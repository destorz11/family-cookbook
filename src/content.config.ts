import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORIES } from './lib/categories';

const ingredient = z.object({
  name: z.string(),
  // Число, которое умножается при пересчёте порций. Не указывайте, если «по вкусу».
  amount: z.number().positive().nullish(),
  // Единицы лучше писать сокращённо, чтобы не склонять: г, кг, мл, л, шт., ст. л., ч. л., стак.
  unit: z.string().nullish(),
  // Пояснение: «гранёный стакан», «на глаз», «можно заменить сметаной».
  note: z.string().nullish(),
  // Группа, если ингредиенты делятся: «Тесто», «Начинка».
  group: z.string().nullish(),
});

const recipes = defineCollection({
  // Файлы, начинающиеся с «_», не попадают на сайт: так хранится шаблон.
  loader: glob({ pattern: ['**/*.md', '!**/_*.md'], base: './src/content/recipes' }),
  schema: z.object({
    title: z.string(),
    author: reference('people'),            // чей рецепт — имя файла из people/
    category: z.enum(CATEGORIES),
    servings: z.number().int().positive(),
    time: z.string().nullish(),             // «1 ч 30 мин»
    origin: z.string().nullish(),           // откуда рецепт, примерные годы
    occasions: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    photo: z.string().nullish(),            // путь от папки public: images/pirog.jpg
    added: z.coerce.date(),                  // когда занесён в книгу
    ingredients: z.array(ingredient).min(1),
  }),
});

const people = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!**/_*.md'], base: './src/content/people' }),
  schema: z.object({
    name: z.string(),                        // как вы его/её называете: «Бабушка Валя»
    fullName: z.string().nullish(),
    relation: z.string().nullish(),         // «бабушка по маме»
    years: z.string().nullish(),            // «1938–2015»
    from: z.string().nullish(),
    photo: z.string().nullish(),
  }),
});

export const collections = { recipes, people };
