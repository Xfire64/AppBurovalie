const Fastify = require("fastify");
const cors = require("@fastify/cors");
const bcrypt = require("bcryptjs");
const { prisma } = require("./prisma");
const { assertLocationAccess, canAccessAllStocks, requireAuth, requireRole, signToken } = require("./auth");

const app = Fastify({ logger: true });

app.register(cors, {
  origin: process.env.CORS_ORIGIN === "*" ? true : process.env.CORS_ORIGIN,
  credentials: true,
});

app.get("/health", async () => ({ ok: true }));

app.post("/auth/login", async (request, reply) => {
  const { email, password } = request.body || {};
  const user = await prisma.user.findUnique({
    where: { email },
    include: { allowedLocations: true },
  });

  if (!user || !bcrypt.compareSync(password || "", user.passwordHash)) {
    return reply.code(401).send({ error: "INVALID_CREDENTIALS" });
  }

  return {
    token: signToken(user),
    user: publicUser(user),
  };
});

app.get("/auth/me", { preHandler: requireAuth }, async (request) => ({
  user: publicUser(request.user),
}));

app.get("/users", { preHandler: requireRole("ADMIN", "RESPONSABLE", "DIRECTION") }, async () => {
  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
    include: { allowedLocations: { include: { location: true } }, primaryLocation: true },
  });
  return users.map(publicUser);
});

app.patch("/users/:id/locations", { preHandler: requireRole("ADMIN", "RESPONSABLE", "DIRECTION") }, async (request) => {
  const locationIds = request.body?.locationIds || [];
  const user = await prisma.user.findUnique({ where: { id: request.params.id } });
  if (!user) return { error: "USER_NOT_FOUND" };

  const ids = new Set(locationIds);
  if (user.primaryLocationId) ids.add(user.primaryLocationId);

  await prisma.$transaction([
    prisma.userLocationAccess.deleteMany({ where: { userId: user.id } }),
    ...[...ids].map((locationId) =>
      prisma.userLocationAccess.create({ data: { userId: user.id, locationId } })
    ),
  ]);

  return { ok: true };
});

app.get("/locations", { preHandler: requireAuth }, async (request) => {
  const where = canAccessAllStocks(request.user)
    ? {}
    : { id: { in: [...new Set(request.user.allowedLocations.map((item) => item.locationId).concat(request.user.primaryLocationId).filter(Boolean))] } };
  return prisma.location.findMany({ where, orderBy: { name: "asc" } });
});

app.post("/locations", { preHandler: requireRole("ADMIN", "RESPONSABLE") }, async (request) => {
  const { name, type } = request.body || {};
  return prisma.location.create({ data: { name, type } });
});

app.get("/articles", { preHandler: requireAuth }, async () => {
  return prisma.article.findMany({
    orderBy: { reference: "asc" },
    include: { barcodes: true },
  });
});

app.post("/articles", { preHandler: requireRole("ADMIN", "RESPONSABLE") }, async (request) => {
  const { reference, description, category, minimum = 0, barcodes = [] } = request.body || {};
  return prisma.article.create({
    data: {
      reference,
      description,
      category,
      minimum: Number(minimum),
      barcodes: { create: barcodes.filter(Boolean).map((code) => ({ code })) },
    },
    include: { barcodes: true },
  });
});

app.get("/stocks", { preHandler: requireAuth }, async (request) => {
  const locationWhere = canAccessAllStocks(request.user)
    ? {}
    : { id: { in: [...new Set(request.user.allowedLocations.map((item) => item.locationId).concat(request.user.primaryLocationId).filter(Boolean))] } };

  return prisma.stock.findMany({
    where: { location: locationWhere },
    include: { article: { include: { barcodes: true } }, location: true },
    orderBy: [{ location: { name: "asc" } }, { article: { reference: "asc" } }],
  });
});

app.post("/movements/batches", { preHandler: requireAuth }, async (request, reply) => {
  const { type, ticketNumber, fromLocationId, toLocationId, lines = [] } = request.body || {};
  const upperType = String(type || "").toUpperCase();

  if (upperType === "EXIT" && !ticketNumber) {
    return reply.code(400).send({ error: "TICKET_REQUIRED" });
  }
  if (!Array.isArray(lines) || lines.length === 0) {
    return reply.code(400).send({ error: "LINES_REQUIRED" });
  }
  if (["EXIT", "TRANSFER"].includes(upperType) && !fromLocationId) {
    return reply.code(400).send({ error: "FROM_LOCATION_REQUIRED" });
  }
  if (["ENTRY", "TRANSFER", "ADJUSTMENT"].includes(upperType) && !toLocationId) {
    return reply.code(400).send({ error: "TO_LOCATION_REQUIRED" });
  }
  if (!assertLocationAccess(request.user, fromLocationId) || !assertLocationAccess(request.user, toLocationId)) {
    return reply.code(403).send({ error: "LOCATION_FORBIDDEN" });
  }

  const result = await prisma.$transaction(async (tx) => {
    const batch = await tx.movementBatch.create({
      data: {
        type: upperType,
        ticketNumber,
        fromLocationId: fromLocationId || null,
        toLocationId: toLocationId || null,
        userId: request.user.id,
      },
    });

    for (const line of lines) {
      await applyMovement(tx, {
        type: upperType,
        articleId: line.articleId,
        quantity: Number(line.quantity),
        fromLocationId,
        toLocationId,
      });

      await tx.movement.create({
        data: {
          type: upperType,
          articleId: line.articleId,
          quantity: Number(line.quantity),
          note: line.note || null,
          ticketNumber: ticketNumber || null,
          fromLocationId: fromLocationId || null,
          toLocationId: toLocationId || null,
          batchId: batch.id,
          userId: request.user.id,
        },
      });
    }

    return tx.movementBatch.findUnique({
      where: { id: batch.id },
      include: batchInclude(),
    });
  });

  return result;
});

app.get("/movements", { preHandler: requireAuth }, async (request) => {
  return prisma.movement.findMany({
    where: visibleMovementWhere(request.user),
    include: { article: true, fromLocation: true, toLocation: true, user: true, batch: true },
    orderBy: { createdAt: "desc" },
    take: Number(request.query.limit || 200),
  });
});

app.get("/batches", { preHandler: requireRole("ADMIN", "RESPONSABLE", "DIRECTION") }, async () => {
  return prisma.movementBatch.findMany({
    include: batchInclude(),
    orderBy: { createdAt: "desc" },
    take: 200,
  });
});

app.patch("/batches/:id/check", { preHandler: requireRole("ADMIN", "RESPONSABLE", "DIRECTION") }, async (request) => {
  return prisma.movementBatch.update({
    where: { id: request.params.id },
    data: {
      checked: true,
      checkedById: request.user.id,
      checkedAt: new Date(),
    },
    include: batchInclude(),
  });
});

app.get("/dashboard/top-articles", { preHandler: requireAuth }, async (request) => {
  const days = request.query.days === "all" ? null : Number(request.query.days || 30);
  const from = days ? new Date(Date.now() - days * 24 * 60 * 60 * 1000) : undefined;

  const groups = await prisma.movement.groupBy({
    by: ["articleId"],
    where: {
      type: "EXIT",
      ...(from ? { createdAt: { gte: from } } : {}),
    },
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 20,
  });

  const articles = await prisma.article.findMany({
    where: { id: { in: groups.map((item) => item.articleId) } },
  });
  const articleById = new Map(articles.map((article) => [article.id, article]));

  return groups.map((item) => ({
    article: articleById.get(item.articleId),
    quantity: item._sum.quantity || 0,
  }));
});

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    primaryLocationId: user.primaryLocationId,
    allowedLocationIds: user.allowedLocations?.map((item) => item.locationId) || [],
  };
}

function batchInclude() {
  return {
    movements: { include: { article: true } },
    fromLocation: true,
    toLocation: true,
    user: true,
    checkedBy: true,
  };
}

function visibleMovementWhere(user) {
  if (canAccessAllStocks(user)) return {};
  const ids = [...new Set(user.allowedLocations.map((item) => item.locationId).concat(user.primaryLocationId).filter(Boolean))];
  return {
    OR: [
      { fromLocationId: { in: ids } },
      { toLocationId: { in: ids } },
    ],
  };
}

async function applyMovement(tx, { type, articleId, quantity, fromLocationId, toLocationId }) {
  if (!quantity || quantity < 1) throw new Error("INVALID_QUANTITY");

  if (["EXIT", "TRANSFER"].includes(type)) {
    const fromStock = await tx.stock.findUnique({
      where: { articleId_locationId: { articleId, locationId: fromLocationId } },
    });
    if (!fromStock || fromStock.quantity < quantity) throw new Error("INSUFFICIENT_STOCK");
    await tx.stock.update({
      where: { articleId_locationId: { articleId, locationId: fromLocationId } },
      data: { quantity: { decrement: quantity } },
    });
  }

  if (["ENTRY", "TRANSFER"].includes(type)) {
    await tx.stock.upsert({
      where: { articleId_locationId: { articleId, locationId: toLocationId } },
      create: { articleId, locationId: toLocationId, quantity },
      update: { quantity: { increment: quantity } },
    });
  }

  if (type === "ADJUSTMENT") {
    await tx.stock.upsert({
      where: { articleId_locationId: { articleId, locationId: toLocationId || fromLocationId } },
      create: { articleId, locationId: toLocationId || fromLocationId, quantity },
      update: { quantity },
    });
  }
}

const port = Number(process.env.PORT || 3000);
app.listen({ host: "0.0.0.0", port }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
