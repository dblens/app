import React from "react";

import HeroHome from "../components/HeroHome";
import Header from "../components/Header";
import FeaturesBlocks from "../components/FeaturesBlocks";
import FeaturesHome from "../components/FeaturesHome";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/*  Site header */}
      <Header />

      {/*  Page content */}
      <main className="flex-grow">
        {/*  Page sections */}
        <HeroHome />
        <FeaturesHome />
        <FeaturesBlocks />
        <Testimonials />
        <Newsletter />
      </main>

      {/*  Site footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;


