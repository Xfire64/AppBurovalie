const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const passwordHash = bcrypt.hashSync("demo1234", 10);

  const depotSiege = await upsertLocation("depot-siege", "Dépôt siège", "DEPOT");
  const depotSite2 = await upsertLocation("depot-site-2", "Dépôt site 2", "DEPOT");
  const depotSite3 = await upsertLocation("depot-site-3", "Dépôt site 3", "DEPOT");
  const vehTech1 = await upsertLocation("veh-tech-1", "Véhicule technicien 1", "VEHICULE");

  const admin = await upsertUser("admin@appburovalie.local", "Admin Burovalie", "ADMIN", depotSiege.id, passwordHash);
  await upsertUser("responsable@appburovalie.local", "Responsable technique", "RESPONSABLE", depotSiege.id, passwordHash);
  await upsertUser("direction@appburovalie.local", "Direction", "DIRECTION", depotSiege.id, passwordHash);
  const tech = await upsertUser("tech1@appburovalie.local", "Technicien 1", "TECHNICIEN", vehTech1.id, passwordHash);

  await setAllowedLocations(tech.id, [vehTech1.id, depotSiege.id]);
  await setAllowedLocations(admin.id, [depotSiege.id, depotSite2.id, depotSite3.id, vehTech1.id]);

  const toner = await upsertArticle("TON-NOIR-01", "Toner noir copieur", "Consommable", 4, ["3760123456789", "3029330003533"]);
  const carte = await upsertArticle("MAJ-CARTE-22", "Carte électronique mise à jour", "Pièce", 2, ["8710398501218"]);
  const rouleau = await upsertArticle("RUL-ENT-12", "Rouleau d'entraînement", "Pièce", 3, ["1234567890128"]);

  await setStock(toner.id, depotSiege.id, 14);
  await setStock(toner.id, depotSite2.id, 3);
  await setStock(toner.id, vehTech1.id, 2);
  await setStock(carte.id, depotSiege.id, 5);
  await setStock(carte.id, vehTech1.id, 1);
  await setStock(rouleau.id, depotSite3.id, 9);
}

async function upsertLocation(id, name, type) {
  return prisma.location.upsert({
    where: { id },
    update: { name, type },
    create: { id, name, type },
  });
}

async function upsertUser(email, name, role, primaryLocationId, passwordHash) {
  return prisma.user.upsert({
    where: { email },
    update: { name, role, primaryLocationId },
    create: { email, name, role, primaryLocationId, passwordHash },
  });
}

async function setAllowedLocations(userId, locationIds) {
  await prisma.userLocationAccess.deleteMany({ where: { userId } });
  await Promise.all(locationIds.map((locationId) =>
    prisma.userLocationAccess.create({ data: { userId, locationId } })
  ));
}

async function upsertArticle(reference, description, category, minimum, barcodes) {
  const article = await prisma.article.upsert({
    where: { reference },
    update: { description, category, minimum },
    create: { reference, description, category, minimum },
  });

  for (const code of barcodes) {
    await prisma.articleBarcode.upsert({
      where: { code },
      update: { articleId: article.id },
      create: { code, articleId: article.id },
    });
  }

  return article;
}

async function setStock(articleId, locationId, quantity) {
  return prisma.stock.upsert({
    where: { articleId_locationId: { articleId, locationId } },
    update: { quantity },
    create: { articleId, locationId, quantity },
  });
}

main()
  .finally(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
