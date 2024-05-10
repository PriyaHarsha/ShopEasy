import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";

const Layout = ({ children, title, description, keywords, author }) => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
      <Header />
      <main className="bg-primary-subtle" style={{ minHeight: "70vh" }}>
        {children}
        <Toaster />
      </main>

      <Footer />
    </div>
  );
};

Layout.defaultProps = {
  title: "Shop Easy",
  description: "Shopping App",
  keywords: "Clothing, Skin care, men,women,kids,saree, skirt,shirt",
  author: "Priya B S",
};

export default Layout;
