import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
const cases = [
  '[Modified Sieve](/en/Theory/Math/Modified Sieve)',
  '[Modified Sieve](</en/Theory/Math/Modified Sieve>)',
  '[Modified Sieve](/en/Theory/Math/Modified%20Sieve)',
  '[lis-2](/en/Problems/lis-2)'
];
for (const c of cases){
  const r = await remark().use(remarkGfm).use(html,{sanitize:false}).process(c);
  console.log(JSON.stringify(c), '=>', r.toString().trim());
}
