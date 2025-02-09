
import { useState } from 'react';
import NumberInput from '../components/NumberInput';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from '../hooks/use-mobile';
import { useToast } from "@/hooks/use-toast";

type Currency = 'BRL' | 'USD' | 'EUR';

const FIXED_RATE = 5; // Taxa fixa: 5 BRL = 1 USD/EUR

const formatCurrency = (value: number, currency: Currency): string => {
  const currencyOptions: { [key in Currency]: { locale: string; currency: string } } = {
    BRL: { locale: 'pt-BR', currency: 'BRL' },
    USD: { locale: 'en-US', currency: 'USD' },
    EUR: { locale: 'de-DE', currency: 'EUR' }
  };

  const { locale, currency: currencyCode } = currencyOptions[currency];
  
  return value.toLocaleString(locale, {
    style: 'currency',
    currency: currencyCode,
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
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('BRL');
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const calculateResults = () => {
    const pricePerHourNum = parseCurrencyInput(pricePerHour);
    const costPerHourNum = parseCurrencyInput(costPerHour);
    const hoursNum = Number(hours) || 0;

    const totalPrice = pricePerHourNum * hoursNum;
    const totalCost = costPerHourNum * hoursNum;
    const profit = totalPrice - totalCost;

    // Conversão usando taxa fixa
    const rate = selectedCurrency === 'BRL' ? 1 : (1 / FIXED_RATE);
    
    setProjectPrice(formatCurrency(totalPrice * rate, selectedCurrency));
    setProjectCost(formatCurrency(totalCost * rate, selectedCurrency));
    setNetProfit(formatCurrency(profit * rate, selectedCurrency));

    // Mostra a taxa fixa atual
    if (selectedCurrency !== 'BRL') {
      toast({
        title: "Taxa de conversão fixa",
        description: `1 ${selectedCurrency} = ${FIXED_RATE} BRL`,
        duration: 3000,
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-800 p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-4 sm:p-8"
      >
        <div className={`flex ${isMobile ? 'flex-col gap-4' : 'justify-between'} items-center mb-8`}>
          <motion.h1 
            variants={itemVariants}
            className="text-2xl sm:text-3xl font-bold text-gray-800"
          >
            Calculadora de Projeto
          </motion.h1>
          
          <motion.div variants={itemVariants}>
            <Select value={selectedCurrency} onValueChange={(value: Currency) => {
              setSelectedCurrency(value);
              calculateResults();
            }}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Moeda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BRL">BRL</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <motion.div variants={itemVariants}>
            <NumberInput
              label="Preço por Hora"
              value={pricePerHour}
              onChange={setPricePerHour}
              prefix="R$"
              className="text-right font-medium"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <NumberInput
              label="Custo por Hora"
              value={costPerHour}
              onChange={setCostPerHour}
              prefix="R$"
              className="text-right font-medium"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <NumberInput
              label="Quantidade de Horas"
              value={hours}
              onChange={setHours}
              className="text-right font-medium"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="pt-4 sm:pt-6 border-t border-gray-100">
            <NumberInput
              label="Preço do Projeto"
              value={projectPrice}
              onChange={() => {}}
              readOnly
              className="text-right font-semibold text-green-600"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <NumberInput
              label="Custo do Projeto"
              value={projectCost}
              onChange={() => {}}
              readOnly
              className="text-right font-semibold text-red-600"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <NumberInput
              label="Ganho Líquido"
              value={netProfit}
              onChange={() => {}}
              readOnly
              className="text-right font-bold text-purple-600 text-lg"
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={calculateResults}
              className="w-full h-12 sm:h-14 bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200 text-base sm:text-lg font-semibold"
            >
              Calcular
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
