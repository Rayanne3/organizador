const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Defina como false se não quiser nenhum dado de exemplo, só o admin
const SEED_EXAMPLE_DATA = true;

async function main() {
  console.log('Limpando banco de dados...');
  await prisma.priceHistory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('Criando usuário administrador...');
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@sistema.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  if (SEED_EXAMPLE_DATA) {
    console.log('Criando categoria de exemplo (apenas para teste)...');

    const categoriaExemplo = await prisma.category.create({
      data: {
        name: 'Categoria Exemplo',
        slug: 'categoria-exemplo',
        color: '#8a7a5c',
        order: 0,
      },
    });

    console.log('Criando produto de exemplo (apenas para teste)...');

    await prisma.product.create({
      data: {
        name: 'Produto Exemplo',
        sku: 'EX-001',
        price: 49.9,
        description: 'Este é um item de demonstração. Você pode editar ou excluir livremente — as categorias e produtos reais são cadastrados por você direto no sistema.',
        status: 'ACTIVE',
        categoryId: categoriaExemplo.id,
        // image fica null propositalmente — o upload é feito pela interface
      },
    });
  }

  console.log('---');
  console.log('Banco de dados populado!');
  console.log('LOGIN ADMIN: admin@sistema.com');
  console.log('SENHA ADMIN: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });