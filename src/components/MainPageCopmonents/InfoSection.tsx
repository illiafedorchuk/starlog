
import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import { InfoCard } from "../InfoCard";
import { cardData } from "../InfoCardElements/CardData";
import FirstCard from "../InfoCardElements/FirstCard";
import SecondCard from "../InfoCardElements/SecondCard";
import ThirdCard from "../InfoCardElements/ThirdCard";

const cardComponents = {
  FirstCard,
  SecondCard,
  ThirdCard,
};

export function InfoSection() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.2,
        delayChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : 40,
      scale: shouldReduceMotion ? 1 : 0.97,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section className="w-full max-w-[1600px] mx-auto mb-16 sm:mb-20 px-5 sm:px-8 md:px-10 lg:px-14 xl:px-20 2xl:px-36">

      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-10 sm:mb-14 lg:mb-20">
        <div>
          <p className="text-xs uppercase text-[var(--secondary)] mb-4 sm:mb-5">
            FROM WORDS TO WORLDS
          </p>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] text-white">
            Your life,
            <br />
            <span className="text-aurora font-medium">
              written in stars.
            </span>
          </h2>
        </div>

        <p className="max-w-xs text-xs leading-relaxed text-[var(--muted-foreground)] sm:text-right">
          Not every moment feels extraordinary.
          <br className="hidden sm:block" />
          But every moment belongs in your universe.
        </p>
      </div>

      {/* Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {cardData.map((item) => {
          const CardComponent =
            cardComponents[item.card as keyof typeof cardComponents];

          return (
            <motion.div
              key={item.id}
              variants={cardVariants}
              className="h-[470px]"
            >
              <InfoCard
                title={item.title}
                footerHeader={item.footerHeader}
                footerText={item.footerText}
                color={item.color}
                sticker={item.sticker}
              >
                <CardComponent />
              </InfoCard>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Bottom decoration */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mt-8 sm:mt-10">
        <hr className="flex-1 max-w-28 border-white/10" />

        <span className="text-[var(--primary)] shrink-0">
          <Star size={10} />
        </span>

        <p className="text-[0.6rem] text-[var(--muted-foreground)] whitespace-nowrap">
          Small moments. A whole universe.
        </p>

        <hr className="flex-1 max-w-28 border-white/10" />
      </div>
    </section>
  );
}
