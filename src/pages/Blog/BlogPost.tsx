import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import { supabase } from '../../core/services/supabase';
import { Container } from '../../shared/components/layout/Container';
import Typography from '../../shared/components/content/Typography';
import { Spinner, Button } from '../../shared/components/ui';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { JsonLd } from '../../shared/components/seo/JsonLd';

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_image: string;
  author: string;
  created_at: string;
}

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .single();

        if (error) throw error;
        setBlog(data);
      } catch (error) {
        console.error('Error fetching blog:', error);
        navigate('/blog');
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) {
      fetchBlog();
    }
  }, [slug, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 pt-24 flex justify-center items-center">
        <Spinner size="lg" variant="primary" />
      </div>
    );
  }

  if (!blog) return null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.title,
    "image": [blog.cover_image],
    "datePublished": blog.created_at,
    "author": [{
        "@type": "Person",
        "name": blog.author,
        "url": "https://hrvasthu.com/about"
      }]
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 pt-24 pb-12">
      <JsonLd data={articleSchema} />
      <Helmet>
        <title>{blog.title} | HR Vasthu</title>
        <meta name="description" content={blog.content.substring(0, 160).replace(/[#*`_]/g, '')} />
      </Helmet>

      <Container size="md">
        <button 
          onClick={() => navigate('/blog')}
          className="flex items-center gap-2 text-stone-500 hover:text-gold-600 mb-8 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back to Articles
        </button>

        <header className="mb-12">
          <Typography variant="display" className="mb-6 leading-tight">
            {blog.title}
          </Typography>
          
          <div className="flex items-center gap-6 text-sm text-stone-500 border-b border-stone-200 dark:border-stone-800 pb-6">
            <div className="flex items-center gap-2">
              <User size={16} className="text-gold-500" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gold-500" />
              <span>{new Date(blog.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </header>

        {blog.cover_image && (
          <div className="mb-12 rounded-2xl overflow-hidden shadow-md">
            <img 
              src={blog.cover_image} 
              alt={blog.title} 
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
        )}

        <article className="prose prose-stone dark:prose-invert prose-lg max-w-none prose-headings:font-serif prose-a:text-gold-600 hover:prose-a:text-gold-500">
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </article>
      </Container>
    </div>
  );
};

export default BlogPost;
