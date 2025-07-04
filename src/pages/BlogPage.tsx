import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Filter, Search } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { blogPosts } from '../data/blog-posts';
import { categories } from '../data/blog-categories';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { BlogCard } from '../components/blog/BlogCard';
import { Skeleton } from '../components/ui/skeleton';
import CategoryFilter from '../components/blog/CategoryFilter';

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  // Simular carregamento para exibir skeletons
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800); // 800ms de loading fake
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const featuredPosts = blogPosts.slice(0, 3);
  const regularPosts = blogPosts.slice(3);

  const filteredPosts = regularPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? post.categories.includes(selectedCategory)
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div
      className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-white'}`}
    >
      <Navbar />

      <header className="pt-32 pb-20 px-4 md:px-8 bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-md">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-extrabold mb-4 leading-tight tracking-tight">
              Blog Dev Frontend
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Aprofunde-se em tópicos de frontend, performance, acessibilidade e
              design de interfaces.
            </p>
          </motion.div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Search and filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <Input
              type="text"
              placeholder="Pesquise artigos..."
              className="pl-10 w-full text-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onChange={setSelectedCategory}
              variant="pills"
              showCounts
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              <i
                className={`text-2xl ${
                  isDarkMode ? 'ri-sun-line' : 'ri-moon-line'
                }`}
              ></i>
            </Button>
          </div>
        </div>

        {/* Featured posts */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">
            Posts em Destaque
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-80 w-full" />
                ))
              : featuredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} featured />
                ))}
          </div>
        </section>

        {/* Regular posts */}
        <section>
          <h2 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">
            Todos os Artigos
          </h2>
          {filteredPosts.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.08,
                  },
                },
              }}
            >
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-64 w-full" />
                  ))
                : filteredPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <BlogCard post={post} />
                    </motion.div>
                  ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Nenhum artigo encontrado com os filtros atuais.
              </p>
              <Button
                className="mt-4"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory(null);
                }}
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
