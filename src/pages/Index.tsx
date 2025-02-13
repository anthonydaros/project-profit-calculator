import { useState } from 'react';
import NumberInput from '../components/NumberInput';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { useIsMobile } from '../hooks/use-mobile';
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
type Currency = 'BRL' | 'USD' | 'EUR';
const FIXED_RATE = 5; // Taxa fixa: 5 BRL = 1 USD/EUR

const formatCurrency = (value: number, currency: Currency): string => {
  const currencyOptions: { [key in Currency]: {
    locale: string;
    currency: string;
  } } = {
    BRL: {
      locale: 'pt-BR',
      currency: 'BRL'
    },
    USD: {
      locale: 'en-US',
      currency: 'USD'
    },
    EUR: {
      locale: 'de-DE',
      currency: 'EUR'
    }
  };
  const {
    locale,
    currency: currencyCode
  } = currencyOptions[currency];
  return value.toLocaleString(locale, {
    style: 'currency',
    currency: currencyCode
  });
};
const parseCurrencyInput = (value: string): number => {
  // Remove todos os caracteres exceto números, vírgula e ponto
  const cleanValue = value.replace(/[^\d,-]/g, '');
  // Substitui vírgula por ponto para o parseFloat funcionar
  const normalizedValue = cleanValue.replace(',', '.');
  // Converte para número
  return parseFloat(normalizedValue) || 0;
};
const Index = () => {
  const [pricePerHour, setPricePerHour] = useState('50,50');
  const [costPerHour, setCostPerHour] = useState('15,50');
  const [hours, setHours] = useState(1);
  const [projectPrice, setProjectPrice] = useState('0');
  const [projectCost, setProjectCost] = useState('0');
  const [netProfit, setNetProfit] = useState('0');
  const isMobile = useIsMobile();
  const {
    toast
  } = useToast();
  const calculateResults = (currency: Currency) => {
    // Parseia os valores de entrada
    const pricePerHourNum = parseCurrencyInput(pricePerHour);
    const costPerHourNum = parseCurrencyInput(costPerHour);
    const hoursNum = hours;

    // Calcula os totais em BRL
    const totalPrice = pricePerHourNum * hoursNum;
    const totalCost = costPerHourNum * hoursNum;
    const profit = totalPrice - totalCost;

    // Define a taxa de conversão baseada na moeda selecionada
    const rate = currency === 'BRL' ? 1 : 1 / FIXED_RATE;

    // Atualiza os valores formatados
    setProjectPrice(formatCurrency(totalPrice * rate, currency));
    setProjectCost(formatCurrency(totalCost * rate, currency));
    setNetProfit(formatCurrency(profit * rate, currency));

    // Mostra a taxa fixa atual
    if (currency !== 'BRL') {
      toast({
        title: "Taxa de conversão fixa",
        description: `1 ${currency} = ${FIXED_RATE} BRL`,
        duration: 3000
      });
    }
  };
  const handleHoursInput = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 160) {
      setHours(numValue);
    }
  };
  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
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
    hidden: {
      opacity: 0,
      x: -20
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-800 p-4">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-4 sm:p-8">
        <motion.h1 variants={itemVariants} className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center">
          Calculadora de Projeto
        </motion.h1>

        <div className="space-y-4 sm:space-y-6">
          <motion.div variants={itemVariants}>
            <NumberInput label="Preço por Hora" value={pricePerHour} onChange={setPricePerHour} prefix="R$" className="text-right font-medium" />
          </motion.div>

          <motion.div variants={itemVariants}>
            <NumberInput label="Custo por Hora" value={costPerHour} onChange={setCostPerHour} prefix="R$" className="text-right font-medium" />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-gray-500 font-medium">
                Quantidade de Horas:
              </label>
              <input type="number" value={hours} onChange={e => handleHoursInput(e.target.value)} className="w-16 text-right text-gray-700 font-medium bg-transparent border-b border-gray-300 focus:border-purple-600 focus:outline-none" min={1} max={160} />
            </div>
            <Slider value={[hours]} onValueChange={value => setHours(value[0])} min={1} max={160} step={1} className="py-4 [&>div]:!bg-purple-600 [&>div[data-orientation=horizontal]]:!h-3 [&>div[role=slider]]:!h-6 [&>div[role=slider]]:!w-6 [&>div[role=slider]]:!bg-purple-700 hover:[&>div[role=slider]]:!bg-purple-800 transition-all duration-200" />
          </motion.div>

          <motion.div variants={itemVariants} className="pt-4 sm:pt-6 border-t border-gray-100">
            <NumberInput label="Preço do Projeto" value={projectPrice} onChange={() => {}} readOnly className="text-right font-semibold text-green-600" />
          </motion.div>

          <motion.div variants={itemVariants}>
            <NumberInput label="Custo do Projeto" value={projectCost} onChange={() => {}} readOnly className="text-right font-semibold text-red-600" />
          </motion.div>

          <motion.div variants={itemVariants}>
            <NumberInput label="Ganho Líquido" value={netProfit} onChange={() => {}} readOnly className="text-right font-bold text-purple-600 text-lg" />
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2 sm:gap-4">
            <Button onClick={() => calculateResults('BRL')} className="h-12 sm:h-14 text-white transition-colors duration-200 text-base sm:text-lg font-semibold bg-lime-700 hover:bg-lime-600">
              Reais
            </Button>
            <Button onClick={() => calculateResults('USD')} className="h-12 sm:h-14 text-white transition-colors duration-200 text-base sm:text-lg font-semibold bg-gray-800 hover:bg-gray-700">
              Dólar
            </Button>
            <Button onClick={() => calculateResults('EUR')} className="h-12 sm:h-14 text-white transition-colors duration-200 text-base sm:text-lg font-semibold bg-amber-700 hover:bg-amber-600">
              Euro
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>;
};
export default Index;