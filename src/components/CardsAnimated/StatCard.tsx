import { motion } from "framer-motion";

export const StatCard = ({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-white p-6 rounded-xl shadow text-center transition"
    >
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-gray-600">{title}</p>
    </motion.div>
  );
};
