const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Limpando banco de dados...');
  await prisma.priceHistory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log('Criando usuário administrador...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.create({
    data: {
      name: 'Administrador ODS',
      email: 'admin@ods.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const products = [
    {
      name: 'iPhone 15 Pro',
      sku: 'ELE-001',
      price: 8500.00,
      category: 'Eletrônicos',
      description: 'Smartphone Apple com chip A17 Pro e câmera de 48MP.',
      imageUrl: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400&h=400&fit=crop',
    },
    {
      name: 'Camiseta Algodão Egípcio',
      sku: 'VEST-010',
      price: 129.90,
      category: 'Vestuário',
      description: 'Camiseta premium com alta durabilidade e conforto.',
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&h=400&fit=crop',
    },
    {
      name: 'Café Especial 500g',
      sku: 'ALI-55',
      price: 45.00,
      category: 'Alimentos',
      description: 'Café torrado em grãos, notas de chocolate e caramelo.',
      imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop',
    }
  ];

  console.log('Populando produtos...');
  for (const product of products) {
    await prisma.product.create({
      data: {
        ...product,
        status: 'ACTIVE'
      }
    });
  }

  console.log('---');
  console.log('Banco de dados populado!');
  console.log('LOGIN ADMIN: admin@ods.com');
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