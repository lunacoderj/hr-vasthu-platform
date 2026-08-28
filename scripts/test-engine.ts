import { generateTopicSections } from './pipeline/04-topic-expansion-engine';
import { generateDynamicOutline } from './pipeline/03-dynamic-outline';
import { analyzeSource } from './pipeline/02-source-analyzer';

const source = analyzeSource('test', 'test', 'పడమర రోడ్ ఇంటి నిర్మాణం', 'మనం పడమర రోడ్ ఉన్నప్పుడు ఏ విధంగా ప్లానింగ్ చేయాలి...');
const outline = generateDynamicOutline(source);
const sections = generateTopicSections(source, outline.sections, 'పడమర రోడ్ ఇంటి నిర్మాణం', 'మనం పడమర రోడ్ ఉన్నప్పుడు ఏ విధంగా ప్లానింగ్ చేయాలి...');

const allText = sections.map(s => s.contentMarkdown).join('\n\n');
const words = allText.split(/\s+/).filter(Boolean).length;
const bodyOnly = allText.replace(/^#+\s+.*$/gm, '').replace(/^---+$/gm, '').replace(/\[\s*[xX ]\s*\]/g, '').replace(/[*_#`|]/g, '').trim();
const meaningfulWords = bodyOnly.split(/\s+/).filter(Boolean).length;

console.log('Sections count:', sections.length);
console.log('Total raw words:', words);
console.log('Meaningful words:', meaningfulWords);
sections.forEach(s => console.log('  sec-' + s.number + ':', s.wordCount, 'words'));
