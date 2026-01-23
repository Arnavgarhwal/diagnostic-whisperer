import { motion } from "framer-motion";
import { ArrowRight, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const blogPosts = [
  {
    title: "Understanding Seasonal Allergies: Causes and Treatments",
    excerpt:
      "Learn about the common triggers of seasonal allergies and discover effective treatments to manage your symptoms.",
    category: "Allergies",
    author: "Dr. Sarah Chen",
    readTime: "5 min read",
    image: "🌸",
    bgColor: "bg-health-coral-light",
  },
  {
    title: "The Science of Sleep: Why Rest Matters for Your Health",
    excerpt:
      "Discover how quality sleep impacts your immune system, mental health, and overall well-being.",
    category: "Wellness",
    author: "Dr. Michael Park",
    readTime: "7 min read",
    image: "😴",
    bgColor: "bg-health-lavender",
  },
  {
    title: "Heart Health: Early Warning Signs You Shouldn't Ignore",
    excerpt:
      "Recognize the subtle symptoms that could indicate heart problems and learn when to seek medical attention.",
    category: "Cardiology",
    author: "Dr. Emily Johnson",
    readTime: "6 min read",
    image: "❤️",
    bgColor: "bg-health-mint",
  },
];

const BlogSection = () => {
  return (
    <section id="blog" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Health <span className="text-gradient">Insights</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              Expert articles and guides to help you make informed health decisions.
            </p>
          </div>
          <Button variant="outline" className="self-start md:self-auto group">
            View All Articles
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
            >
              <div className="h-full rounded-2xl bg-card border border-border/50 overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300">
                {/* Image Placeholder */}
                <div
                  className={`h-48 ${post.bgColor} flex items-center justify-center`}
                >
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                    {post.image}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold mb-4">
                    {post.category}
                  </span>

                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
