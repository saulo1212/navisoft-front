'use client';

import PageBreadcrumb from '@/components/PageBreadcrumb';
import { useState } from 'react';
import Header from './components/Header';
import { imageData } from './components/ImagesTab';
import PreviewModal from './components/PreviewModal';
import TabsContent from './components/TabsContent';
const Page = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const openModal = index => {
    setActiveIndex(index);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
    setActiveIndex(null);
  };
  const handlePrev = () => {
    if (activeIndex !== null) {
      setActiveIndex(prev => prev === 0 ? imageData.length - 1 : (prev ?? 0) - 1);
    }
  };
  const handleNext = () => {
    if (activeIndex !== null) {
      setActiveIndex(prev => prev === imageData.length - 1 ? 0 : (prev ?? 0) + 1);
    }
  };
  const currentItem = activeIndex !== null ? imageData[activeIndex] : null;
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Forum View'} subTitle1={'Layouts'} subTitle2={'Miscellaneous'} subText="Full forum view system, with threads and posts." />
        <div className="main-content layout-trimmed">
          <Header />
          <TabsContent openModal={openModal} />
        </div>

        <PreviewModal isOpen={isOpen} currentItem={currentItem} closeModal={closeModal} handlePrev={handlePrev} handleNext={handleNext} />
      </div>
    </>;
};
export default Page;