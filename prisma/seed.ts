const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

function slugify(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  console.log('Limpando banco de dados...');
  await prisma.priceHistory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('Criando usuário administrador...');
  const hashedPassword = await bcrypt.hash('tubaraosubterraneo', 10);

  await prisma.user.create({
    data: {
      name: 'Adriano',
      email: 'adrianok9@gmail.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Criando categorias...');

  const categoriesData = [
    { name: 'Pneus', color: '#5c5f66', order: 0 },
    { name: 'Serviços', color: '#7a8c6e', order: 1 },
    { name: 'Rodas e Calotas', color: '#5f7a8a', order: 2 },
    { name: 'Câmaras e Reparos', color: '#a3554a', order: 3 },
    { name: 'Óleos e Fluidos', color: '#7d7a4a', order: 4 },
    { name: 'Acessórios', color: '#8a5f7a', order: 5 },
    { name: 'Baterias', color: '#a1906d', order: 6 },
  ];

  const categories: Record<string, any> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({
      data: { name: cat.name, slug: slugify(cat.name), color: cat.color, order: cat.order },
    });
    categories[cat.name] = created;
  }

  console.log('Criando produtos...');

  const products = [
    // Pneus
    { name: 'Pneu Aro 13 175/70', sku: 'PNE-13175', price: 289.9, category: 'Pneus', description: 'Pneu radial para veículos de passeio compactos, ótimo custo-benefício e boa durabilidade.' },
    { name: 'Pneu Aro 14 185/65', sku: 'PNE-14185', price: 329.9, category: 'Pneus', description: 'Indicado para uso urbano, com boa aderência em piso molhado.' },
    { name: 'Pneu Aro 15 195/60', sku: 'PNE-15195', price: 389.0, category: 'Pneus', description: 'Equilíbrio entre conforto e desempenho para sedãs médios.' },
    { name: 'Pneu Aro 16 205/55 Esportivo', sku: 'PNE-16205', price: 459.0, category: 'Pneus', description: 'Composto mais macio para maior aderência em curvas.' },
    { name: 'Pneu Aro 17 215/50 Performance', sku: 'PNE-17215', price: 549.0, category: 'Pneus', description: 'Alta performance, recomendado para carros esportivos.' },
    { name: 'Pneu Aro 15 Caminhonete 205/70', sku: 'PNE-15CAM', price: 499.0, category: 'Pneus', description: 'Reforçado, ideal para picapes e uso misto estrada/cidade.' },
    { name: 'Pneu Moto 100/90-18', sku: 'PNE-MOTO18', price: 219.9, category: 'Pneus', description: 'Pneu traseiro para motocicletas de médio porte.' },

    // Serviços
    { name: 'Alinhamento e Balanceamento', sku: 'SRV-ALIBAL', price: 90.0, category: 'Serviços', description: 'Serviço completo de alinhamento de direção e balanceamento das 4 rodas.' },
    { name: 'Rodízio de Pneus', sku: 'SRV-RODIZIO', price: 40.0, category: 'Serviços', description: 'Troca de posição dos pneus para desgaste uniforme.' },
    { name: 'Reparo de Furo (Buchão)', sku: 'SRV-REPARO', price: 35.0, category: 'Serviços', description: 'Conserto de furo simples com buchão vulcanizado.' },
    { name: 'Calibragem com Nitrogênio', sku: 'SRV-NITRO', price: 25.0, category: 'Serviços', description: 'Enchimento dos pneus com nitrogênio, mantém a pressão por mais tempo.' },
    { name: 'Montagem e Desmontagem de Pneu', sku: 'SRV-MONTDESM', price: 20.0, category: 'Serviços', description: 'Serviço avulso de montagem/desmontagem por pneu.' },
    { name: 'Revisão de Suspensão', sku: 'SRV-SUSPENSAO', price: 120.0, category: 'Serviços', description: 'Checagem completa de amortecedores, molas e buchas.' },

    // Rodas e Calotas
    { name: 'Roda Liga Leve Aro 15', sku: 'RDA-LIGA15', price: 380.0, category: 'Rodas e Calotas', description: 'Roda de liga leve 4 furos, acabamento diamantado.' },
    { name: 'Roda Liga Leve Aro 17', sku: 'RDA-LIGA17', price: 520.0, category: 'Rodas e Calotas', description: 'Design esportivo, compatível com a maioria dos hatches médios.' },
    { name: 'Calota Aro 13 Jogo com 4', sku: 'RDA-CAL13', price: 89.9, category: 'Rodas e Calotas', description: 'Jogo completo, encaixe universal.' },
    { name: 'Calota Aro 14 Esportiva Jogo com 4', sku: 'RDA-CAL14', price: 99.9, category: 'Rodas e Calotas', description: 'Modelo esportivo com detalhes cromados.' },

    // Câmaras e Reparos
    { name: 'Câmara de Ar Aro 13', sku: 'CAM-13', price: 29.9, category: 'Câmaras e Reparos', description: 'Câmara de ar padrão para pneus aro 13.' },
    { name: 'Câmara de Ar Moto', sku: 'CAM-MOTO', price: 24.9, category: 'Câmaras e Reparos', description: 'Câmara reforçada para motocicletas.' },
    { name: 'Kit Remendo a Frio', sku: 'CAM-KITFRIO', price: 18.5, category: 'Câmaras e Reparos', description: 'Kit completo com cola e lixa para reparo emergencial.' },
    { name: 'Válvula de Pneu (unidade)', sku: 'CAM-VALV', price: 5.0, category: 'Câmaras e Reparos', description: 'Válvula de borracha padrão, substituição simples.' },

    // Óleos e Fluidos
    { name: 'Óleo de Motor 5W30 Sintético (Litro)', sku: 'OLE-5W30', price: 45.0, category: 'Óleos e Fluidos', description: 'Alta proteção contra desgaste, indicado para motores modernos.' },
    { name: 'Óleo de Motor 20W50 Mineral (Litro)', sku: 'OLE-20W50', price: 28.0, category: 'Óleos e Fluidos', description: 'Indicado para veículos mais antigos.' },
    { name: 'Fluido de Freio DOT 4', sku: 'OLE-DOT4', price: 22.0, category: 'Óleos e Fluidos', description: 'Alto ponto de ebulição, recomendado para uso geral.' },
    { name: 'Aditivo Radiador Concentrado', sku: 'OLE-ADIT', price: 32.0, category: 'Óleos e Fluidos', description: 'Protege contra corrosão e superaquecimento.' },

    // Acessórios
    { name: 'Tapete Automotivo Universal (Jogo)', sku: 'ACS-TAPETE', price: 79.9, category: 'Acessórios', description: 'Jogo com 4 peças, material emborrachado resistente.' },
    { name: 'Capa de Estepe Universal', sku: 'ACS-CAPESTP', price: 49.9, category: 'Acessórios', description: 'Proteção contra sol e chuva para o estepe.' },
    { name: 'Chave de Roda Cruzeta', sku: 'ACS-CRUZETA', price: 35.0, category: 'Acessórios', description: 'Chave em aço forjado, encaixe universal.' },
    { name: 'Macaco Hidráulico 2 Toneladas', sku: 'ACS-MACACO', price: 159.9, category: 'Acessórios', description: 'Ideal para troca de pneus e manutenções rápidas.' },

    // Baterias
    { name: 'Bateria 60Ah', sku: 'BAT-60AH', price: 449.0, category: 'Baterias', description: 'Bateria automotiva 60 amperes, garantia de 12 meses.' },
    { name: 'Bateria 45Ah', sku: 'BAT-45AH', price: 379.0, category: 'Baterias', description: 'Indicada para veículos de passeio compactos.' },
    { name: 'Bateria Moto 5Ah', sku: 'BAT-5AHMOTO', price: 189.0, category: 'Baterias', description: 'Bateria selada, livre de manutenção, para motocicletas.' },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: {
        name: product.name,
        sku: product.sku,
        price: product.price,
        description: product.description,
        status: 'ACTIVE',
        categoryId: categories[product.category].id,
      },
    });
  }

  console.log('---');
  console.log('Banco de dados populado!');
  console.log(`Categorias: ${Object.keys(categories).length}`);
  console.log(`Produtos: ${products.length}`);
  console.log('LOGIN ADMIN: adrianok9@gmail.com');
  console.log('SENHA ADMIN: tubaraosubterraneo');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });