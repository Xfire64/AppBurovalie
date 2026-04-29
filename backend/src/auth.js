const jwt = require("jsonwebtoken");
const { prisma } = require("./prisma");

const roleRank = {
  TECHNICIEN: 1,
  RESPONSABLE: 2,
  DIRECTION: 3,
  ADMIN: 4,
};

function signToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "12h" }
  );
}

async function requireAuth(request, reply) {
  const header = request.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    return reply.code(401).send({ error: "AUTH_REQUIRED" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { allowedLocations: true },
    });

    if (!user) {
      return reply.code(401).send({ error: "AUTH_REQUIRED" });
    }

    request.user = user;
  } catch {
    return reply.code(401).send({ error: "AUTH_REQUIRED" });
  }
}

function requireRole(...roles) {
  return async function roleGuard(request, reply) {
    await requireAuth(request, reply);
    if (reply.sent) return;
    if (!roles.includes(request.user.role)) {
      return reply.code(403).send({ error: "FORBIDDEN" });
    }
  };
}

function canAccessAllStocks(user) {
  return ["ADMIN", "RESPONSABLE", "DIRECTION"].includes(user.role);
}

function allowedLocationIds(user) {
  if (canAccessAllStocks(user)) return null;
  const ids = new Set(user.allowedLocations.map((item) => item.locationId));
  if (user.primaryLocationId) ids.add(user.primaryLocationId);
  return ids;
}

function assertLocationAccess(user, locationId) {
  if (!locationId || canAccessAllStocks(user)) return true;
  return allowedLocationIds(user).has(locationId);
}

module.exports = {
  allowedLocationIds,
  assertLocationAccess,
  canAccessAllStocks,
  requireAuth,
  requireRole,
  roleRank,
  signToken,
};
