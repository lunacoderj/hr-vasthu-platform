import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../../core/services/supabase';
import { Container } from '../../shared/components/layout/Container';
import Typography from '../../shared/components/content/Typography';
import { Spinner } from '../../shared/components/ui';
import { Calendar, User } from 'lucide-react';

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_image: string;
  author: string;
  created_at: string;
}

export const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('id, title, slug, content, cover_image, author, created_at')
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setBlogs(data || []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 pt-24 pb-12">
      <Helmet>
        <title>Vastu Shastra Blog | HR Vasthu</title>
        <meta name="description" content="Read the latest articles on Vastu Shastra by Dr. Kunchala Hanumantha Rao. Transform your life and living spaces with ancient Indian architecture wisdom." />
      </Helmet>

      <Container size="xl">
        <div className="mb-16 max-w-2xl">
          <Typography variant="display" className="mb-4">
            Vastu Insights
          </Typography>
          <Typography variant="body" className="text-stone-600 dark:text-stone-400 text-lg">
            Discover articles, tips, and profound insights into the ancient science of Vastu Shastra.
          </Typography>
        </div>

        {isLoading ? (
          <div className="py-24 flex justify-center items-center">
            <Spinner size="lg" variant="primary" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-24">
            <Typography variant="h3" className="text-stone-400">New articles coming soon.</Typography>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-stone-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-stone-200 dark:border-stone-800 flex flex-col"
              >
                {blog.cover_image && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={blog.cover_image} 
                      alt={blog.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <Link to={`/blog/${blog.slug}`} className="group">
                    <Typography variant="h3" className="mb-3 group-hover:text-gold-600 transition-colors line-clamp-2">
                      {blog.title}
                    </Typography>
                  </Link>
                  <p className="text-stone-600 dark:text-stone-400 text-sm mb-6 line-clamp-3">
                    {blog.content.substring(0, 150).replace(/[#*`_]/g, '')}...
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between text-xs text-stone-500 pt-4 border-t border-stone-100 dark:border-stone-800">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {new Date(blog.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User size={14} />
                      {blog.author}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default BlogList;
