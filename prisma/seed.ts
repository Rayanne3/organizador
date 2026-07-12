const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Limpando banco de dados...');
  await prisma.product.deleteMany();

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
    },
    {
      name: 'Mesa Escrivaninha Industrial',
      sku: 'CASA-200',
      price: 480.00,
      category: 'Casa',
      description: 'Mesa de madeira com pés em ferro preto.',
      imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=400&fit=crop',
    },
    {
      name: 'Caderno Moleskine G',
      sku: 'PAP-009',
      price: 110.00,
      category: 'Papelaria',
      description: 'Caderno pautado com capa dura preta.',
      imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=400&fit=crop',
    },
    {
      name: 'Perfume Noir Extreme',
      sku: 'BEA-12',
      price: 650.00,
      category: 'Beleza',
      description: 'Fragrância intensa para ocasiões especiais.',
      imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
    }
  ];

  console.log('Populando produtos...');
  for (const product of products) {
    await prisma.product.create({
      data: product
    });
  }

  console.log('Banco de dados populado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });