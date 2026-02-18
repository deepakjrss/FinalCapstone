const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Game = require('./models/Game');
const connectDB = require('./config/db');

dotenv.config();

const sampleGames = [
  {
    title: 'Renewable Energy Basics',
    description: 'Test your knowledge about renewable energy sources like solar, wind, and hydro power.',
    category: 'renewable-energy',
    difficulty: 'easy',
    maxPoints: 100,
    minPassScore: 60,
    questions: [
      {
        questionText: 'Which of the following is a renewable energy source?',
        options: ['Coal', 'Solar Energy', 'Natural Gas', 'Oil'],
        correctAnswer: 1,
        explanation: 'Solar energy is renewable as it comes from the sun and will not deplete.'
      },
      {
        questionText: 'What is the process by which plants convert sunlight into chemical energy?',
        options: ['Respiration', 'Photosynthesis', 'Fermentation', 'Transpiration'],
        correctAnswer: 1,
        explanation: 'Photosynthesis is the process where plants use sunlight to create energy.'
      },
      {
        questionText: 'Which renewable energy source harnesses the power of moving water?',
        options: ['Wind Power', 'Hydroelectric Power', 'Geothermal Energy', 'Tidal Power'],
        correctAnswer: 1,
        explanation: 'Hydroelectric power uses flowing or falling water to generate electricity.'
      },
      {
        questionText: 'What percentage of Earth\'s energy could theoretically come from solar power?',
        options: ['Less than 1%', '10-20%', 'More than needed for global demand', '50%'],
        correctAnswer: 2,
        explanation: 'The sun provides more energy than the entire planet needs.'
      }
    ]
  },
  {
    title: 'Climate Change Awareness',
    description: 'Learn about climate change, causes, effects, and solutions to combat global warming.',
    category: 'climate',
    difficulty: 'medium',
    maxPoints: 150,
    minPassScore: 70,
    questions: [
      {
        questionText: 'What is the primary greenhouse gas responsible for climate change?',
        options: ['Nitrogen', 'Oxygen', 'Carbon Dioxide', 'Hydrogen'],
        correctAnswer: 2,
        explanation: 'CO2 is the main greenhouse gas contributing to global warming.'
      },
      {
        questionText: 'What has been the average global temperature increase over the last century?',
        options: ['0.5°C', '1°C', '2°C', '5°C'],
        correctAnswer: 1,
        explanation: 'Global temperatures have risen by approximately 1°C since pre-industrial times.'
      },
      {
        questionText: 'Which human activity is the largest contributor to carbon emissions?',
        options: ['Agriculture', 'Energy production and use', 'Deforestation', 'Transportation'],
        correctAnswer: 1,
        explanation: 'Burning fossil fuels for energy is the largest source of CO2 emissions.'
      },
      {
        questionText: 'What does the Paris Agreement aim to do?',
        options: [
          'Ban all fossil fuels',
          'Limit global warming to well below 2°C',
          'Eliminate poverty',
          'Stop all human activity'
        ],
        correctAnswer: 1,
        explanation: 'The Paris Agreement aims to limit global warming to below 2°C above pre-industrial levels.'
      },
      {
        questionText: 'Which of the following is NOT a direct effect of climate change?',
        options: ['Rising sea levels', 'Increased biodiversity', 'More extreme weather', 'Melting glaciers'],
        correctAnswer: 1,
        explanation: 'Climate change leads to decreased biodiversity, not increased.'
      }
    ]
  },
  {
    title: 'Waste Management & Recycling',
    description: 'Understand the importance of waste reduction, recycling, and proper waste disposal.',
    category: 'waste-management',
    difficulty: 'easy',
    maxPoints: 100,
    minPassScore: 60,
    questions: [
      {
        questionText: 'What is the first step in the waste hierarchy?',
        options: ['Recycle', 'Reduce', 'Reuse', 'Recover'],
        correctAnswer: 1,
        explanation: 'Reduction is the most effective way to minimize waste.'
      },
      {
        questionText: 'Approximately how long does a plastic bag take to decompose?',
        options: ['1-5 years', '20-30 years', '100-200 years', '1000+ years'],
        correctAnswer: 2,
        explanation: 'Plastic bags can take 100-1000 years to fully decompose.'
      },
      {
        questionText: 'Which material can be recycled infinitely without losing quality?',
        options: ['Paper', 'Plastic', 'Aluminum', 'Glass'],
        correctAnswer: 3,
        explanation: 'Glass can be recycled indefinitely without degradation.'
      }
    ]
  },
  {
    title: 'Sustainable Living Practices',
    description: 'Discover practical ways to live sustainably and reduce your environmental impact.',
    category: 'sustainability',
    difficulty: 'medium',
    maxPoints: 120,
    minPassScore: 65,
    questions: [
      {
        questionText: 'Which of these has the lowest carbon footprint?',
        options: ['Beef', 'Chicken', 'Vegetables', 'Dairy'],
        correctAnswer: 2,
        explanation: 'Plant-based foods have significantly lower carbon footprints than animal products.'
      },
      {
        questionText: 'How much water does an average person use per day?',
        options: ['20-30 liters', '50-100 liters', '150-200 liters', '300-400 liters'],
        correctAnswer: 3,
        explanation: 'Average global water use is 300-400 liters per person per day.'
      },
      {
        questionText: 'What is the most effective way to reduce household plastic use?',
        options: ['Buy plastic products', 'Use reusable bags and containers', 'Recycle plastic', 'Compost plastic'],
        correctAnswer: 1,
        explanation: 'Using reusable alternatives prevents plastic from entering the waste stream.'
      },
      {
        questionText: 'Which transportation method has the lowest environmental impact?',
        options: ['Car', 'Bus', 'Bicycle', 'Airplane'],
        correctAnswer: 2,
        explanation: 'Bicycles have zero emissions and are the most sustainable transport option.'
      }
    ]
  },
  {
    title: 'Biodiversity & Conservation',
    description: 'Learn about protecting ecosystems and preventing species extinction.',
    category: 'conservation',
    difficulty: 'hard',
    maxPoints: 200,
    minPassScore: 75,
    questions: [
      {
        questionText: 'What is the current extinction rate compared to the natural background rate?',
        options: ['10x faster', '100x faster', '1000x faster', 'Same rate'],
        correctAnswer: 2,
        explanation: 'Species are going extinct at 1000x the natural background rate due to human activity.'
      },
      {
        questionText: 'Which habitat is most affected by deforestation?',
        options: ['Tundra', 'Desert', 'Rainforest', 'Grassland'],
        correctAnswer: 2,
        explanation: 'Rainforests are being destroyed at an alarming rate despite their biodiversity importance.'
      },
      {
        questionText: 'What percentage of Earth\'s biodiversity is found in tropical regions?',
        options: ['20%', '40%', '60%', '80%'],
        correctAnswer: 2,
        explanation: 'Tropical regions contain about 60% of Earth\'s species despite covering only 10% of land.'
      },
      {
        questionText: 'Which of these is a keystone species?',
        options: ['Deer', 'Wolf', 'Grass', 'Insect'],
        correctAnswer: 1,
        explanation: 'Wolves are keystone species whose presence affects entire ecosystem balance.'
      },
      {
        questionText: 'What is ecosystem resilience?',
        options: [
          'The size of an ecosystem',
          'The ability of an ecosystem to recover from disturbance',
          'The number of species in an ecosystem',
          'The climate of an ecosystem'
        ],
        correctAnswer: 1,
        explanation: 'Resilience is the capacity of an ecosystem to recover and maintain function after disruption.'
      }
    ]
  }
];

async function seedGames() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing games
    await Game.deleteMany({});
    console.log('Cleared existing games');

    // Insert sample games
    const createdGames = await Game.insertMany(sampleGames);
    console.log(`Successfully seeded ${createdGames.length} games`);

    // Display seeded games
    const games = await Game.find().select('_id title category');
    console.log('\nSeeded Games:');
    games.forEach((game) => {
      console.log(`- ${game.title} (${game.category}) - ID: ${game._id}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding games:', error.message);
    process.exit(1);
  }
}

seedGames();
