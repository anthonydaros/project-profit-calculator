
import { useState, useEffect } from 'react';
import NumberInput from '../components/NumberInput';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

const parseCurrencyInput = (value: string): number => {
  return Number(value.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
};

const Index = () => {
  const [pricePerHour, setPricePerHour] = useState('50,50');
  const [costPerHour, setCostPerHour] = useState('15,50');
  const [hours, setHours] = useState('');
  const [projectPrice, setProjectPrice] = useState('0');
  const [projectCost, setProjectCost] = useState('0');
  const [netProfit, setNetProfit] = useState('0');

  const calculateResults = () => {
    const pricePerHourNum = parseCurrencyInput(pricePerHour);
    const costPerHourNum = parseCurrencyInput(costPerHour);
    const hoursNum = Number(hours) || 0;

    const totalPrice = pricePerHourNum * hoursNum;
    const totalCost = costPerHourNum * hoursNum;
    const profit = totalPrice - totalCost;

    setProjectPrice(formatCurrency(totalPrice));
    setProjectCost(formatCurrency(totalCost));
    setNetProfit(formatCurrency(profit));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 space-y-6"
      >
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-semibold text-center text-gray-800 mb-8"
        >
          Calculadora de Projeto
        </motion.h1>

        <div className="space-y-6">
          <NumberInput
            label="Preço por Hora"
            value={pricePerHour}
            onChange={setPricePerHour}
            prefix="R$"
          />

          <NumberInput
            label="Custo por Hora"
            value={costPerHour}
            onChange={setCostPerHour}
            prefix="R$"
          />

          <NumberInput
            label="Quantidade de Horas"
            value={hours}
            onChange={setHours}
          />

          <div className="pt-6 border-t border-gray-100">
            <NumberInput
              label="Preço do Projeto"
              value={projectPrice}
              onChange={() => {}}
              readOnly
              className="bg-gray-50"
            />
          </div>

          <NumberInput
            label="Custo do Projeto"
            value={projectCost}
            onChange={() => {}}
            readOnly
            className="bg-gray-50"
          />

          <NumberInput
            label="Ganho Líquido"
            value={netProfit}
            onChange={() => {}}
            readOnly
            className="bg-gray-50"
          />

          <Button
            onClick={calculateResults}
            className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200"
          >
            Calcular
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
