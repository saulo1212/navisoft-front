import Header from "@/app/landing/components/Header";
import Hero from "@/app/landing/components/Hero";
import Features from "@/app/landing/components/Features";
import Demo from "@/app/landing/components/Demo";
import Journey from "@/app/landing/components/Journey";
import NewsLetter from "@/app/landing/components/NewsLetter";
import Faqs from "@/app/landing/components/Faqs";
import Footer from "@/app/landing/components/Footer";
import Contact from "@/app/landing/components/Contact";
import {Metadata} from "next";

export const metadata:Metadata = {title:'Landing'}

const Landing = () => {
    return (
        <div className='app-landing'>
            <Header/>
            <Hero/>
            <Features/>
            <Demo/>
            <Journey/>
            <NewsLetter/>
            <Faqs/>
            <Contact/>
            <Footer/>
        </div>
    );
};

export default Landing;
