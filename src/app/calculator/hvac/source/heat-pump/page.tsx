'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, Calculator, Zap, Thermometer, Settings } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// 数据接口定义
interface HP_Default {
  building_type: string
  city: string
  demand_type: string
  exist_heat: string
  area: string
  heat_indicator: string
  dhw_load: string
  heating_days: string
  runtime_per_day: string
  winter_load_ratio: string
  cooling_demand: boolean
  summer_load_ratio: string
  exist_efficiency: string
  gas_price: string
  elec_price: string
  gas_co2: string
  elec_co2: string
  climate_data: string
  hp_type: string
  hp_capacity: string
  heat_cop: string
  cool_cop: string
  price_per_kw: string
}

interface HP_ChillerDB {
  type: string
  min_capacity: number
  max_capacity: number
  heat_cop_45: number
  cool_cop: number
  iplv: number
  price_per_kw: number
  brand: string
  compressor: string
  source: string
}

interface CompressorMapping {
  model: string
  heat_correction: number
  cool_correction: number
  iplv_correction: number
  note: string
}

interface RefSystem {
  heat_source: string
  efficiency: number
  fuel_value: number
  unit: string
  maintenance_factor: number
  note: string
}

interface TempCorrection {
  hp_type: string
  temps: { [key: string]: number }
}

interface TempProfile {
  temp: number
  hours: number
}

interface CityEnergyPrices {
  city: string
  gas_price: number
  elec_price: number
}

interface HP_Result {
  design_heat_load: number
  annual_heat_demand: number
  annual_dhw_demand: number
  total_heat_demand: number
  rated_cop: number
  compressor_correction: number
  corrected_cop: number
  weighted_cop: number
  defrost_factor: number
  annual_electricity: number
  annual_elec_cost: number
  existing_fuel_amount: number
  existing_energy_cost: number
  annual_savings: number
  annual_energy_savings: number
  annual_co2_reduction: number
  hp_capacity: number
  initial_investment: number
  payback_period: number
  cooling_additional_savings: number
}

export default function HeatPumpCalculatorPage() {
  const [showResults, setShowResults] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState<HP_Result | null>(null)

  // 城市能源价格数据
  const cityEnergyPrices: CityEnergyPrices[] = [
    { city: '北京', gas_price: 3.2, elec_price: 0.75 },
    { city: '上海', gas_price: 3.5, elec_price: 0.85 },
    { city: '哈尔滨', gas_price: 3.0, elec_price: 0.68 },
    { city: '广州', gas_price: 3.8, elec_price: 0.88 },
    { city: '成都', gas_price: 3.1, elec_price: 0.72 }
  ]

  // 默认数据
  const [formData, setFormData] = useState<HP_Default>({
    building_type: '办公楼',
    city: '北京',
    demand_type: '采暖+生活热水',
    exist_heat: '燃气锅炉',
    area: '10000',
    heat_indicator: '60',
    dhw_load: '15',
    heating_days: '120',
    runtime_per_day: '12',
    winter_load_ratio: '70',
    cooling_demand: true,
    summer_load_ratio: '60',
    exist_efficiency: '0.90',
    gas_price: '3.2',
    elec_price: '0.75',
    gas_co2: '2.16',
    elec_co2: '0.858',
    climate_data: '0',
    hp_type: '空气源热泵（低温）',
    hp_capacity: '300',
    heat_cop: '2.5',
    cool_cop: '2.7',
    price_per_kw: '720'
  })

  // 热泵主机库数据
  const hpChillerDB: HP_ChillerDB[] = [
    {
      type: '空气源热泵（常温）',
      min_capacity: 30,
      max_capacity: 500,
      heat_cop_45: 3.2,
      cool_cop: 2.9,
      iplv: 3.5,
      price_per_kw: 550,
      brand: '格力Ultra Heat',
      compressor: '谷轮ZW108',
      source: '2024政采'
    },
    {
      type: '空气源热泵（低温）',
      min_capacity: 30,
      max_capacity: 300,
      heat_cop_45: 2.5,
      cool_cop: 2.7,
      iplv: 3.0,
      price_per_kw: 720,
      brand: '约克YCAE-Pro',
      compressor: '比泽尔CSW105',
      source: '2024政采'
    },
    {
      type: '水源/地源热泵',
      min_capacity: 100,
      max_capacity: 2000,
      heat_cop_45: 4.8,
      cool_cop: 5.5,
      iplv: 6.2,
      price_per_kw: 900,
      brand: '克莱门特',
      compressor: '丹佛斯VZH118',
      source: '水地源均值'
    },
    {
      type: '污水源热泵',
      min_capacity: 100,
      max_capacity: 1000,
      heat_cop_45: 4.2,
      cool_cop: 5.0,
      iplv: 5.5,
      price_per_kw: 850,
      brand: '贝莱特',
      compressor: '松下6TD108',
      source: '2023山东'
    }
  ]

  // 压缩机映射表
  const compressorMapping: CompressorMapping[] = [
    { model: '比泽尔CSW105', heat_correction: 1.00, cool_correction: 1.00, iplv_correction: 1.00, note: '基准' },
    { model: '丹佛斯VZH118', heat_correction: 1.04, cool_correction: 1.03, iplv_correction: 1.05, note: '2024实测' },
    { model: '谷轮ZW108', heat_correction: 1.02, cool_correction: 1.01, iplv_correction: 1.03, note: 'EN14511' },
    { model: '松下6TD108', heat_correction: 0.98, cool_correction: 0.99, iplv_correction: 0.97, note: '低温机型' },
    { model: '三菱KNB092', heat_correction: 1.05, cool_correction: 1.04, iplv_correction: 1.06, note: '变频喷焓' }
  ]

  // 对标系统数据
  const refSystem: RefSystem[] = [
    { heat_source: '燃煤锅炉', efficiency: 0.65, fuel_value: 20, unit: 'MJ/kg', maintenance_factor: 0.98, note: 'GB/T 17954' },
    { heat_source: '燃气锅炉', efficiency: 0.90, fuel_value: 35.6, unit: 'MJ/Nm³', maintenance_factor: 0.98, note: 'GB 13271' },
    { heat_source: '电锅炉', efficiency: 0.98, fuel_value: 3.6, unit: 'MJ/kWh', maintenance_factor: 1.00, note: '电阻式' },
    { heat_source: '柴油锅炉', efficiency: 0.85, fuel_value: 42.7, unit: 'MJ/L', maintenance_factor: 0.97, note: '企业样本' },
    { heat_source: '蒸汽管网', efficiency: 0.85, fuel_value: 0, unit: '-', maintenance_factor: 0.96, note: '换热后' }
  ]

  // 环境温度修正数据
  const tempCorrection: TempCorrection[] = [
    {
      hp_type: '空气源热泵（常温）',
      temps: { '-25': 1.8, '-20': 2.0, '-15': 2.2, '-10': 2.4, '-5': 2.6, '0': 2.8, '5': 3.0, '10': 3.2, '15': 3.3, '20': 3.4, '25': 3.3, '35': 3.1, '45': 2.9 }
    },
    {
      hp_type: '空气源热泵（低温）',
      temps: { '-25': 2.1, '-20': 2.2, '-15': 2.3, '-10': 2.4, '-5': 2.5, '0': 2.6, '5': 2.7, '10': 2.8, '15': 2.9, '20': 3.0, '25': 2.9, '35': 2.7, '45': 2.5 }
    },
    {
      hp_type: '水源/地源热泵',
      temps: { '-25': 4.8, '-20': 4.8, '-15': 4.8, '-10': 4.8, '-5': 4.8, '0': 4.8, '5': 4.8, '10': 4.8, '15': 4.8, '20': 4.8, '25': 4.8, '35': 4.8, '45': 4.8 }
    },
    {
      hp_type: '污水源热泵',
      temps: { '-25': 4.2, '-20': 4.2, '-15': 4.2, '-10': 4.2, '-5': 4.2, '0': 4.2, '5': 4.2, '10': 4.2, '15': 4.2, '20': 4.2, '25': 4.2, '35': 4.2, '45': 4.2 }
    }
  ]

  // 北京温度小时分布（示例）
  const tempProfile: TempProfile[] = [
    { temp: -25, hours: 22 },
    { temp: -20, hours: 58 },
    { temp: -15, hours: 105 },
    { temp: -10, hours: 160 },
    { temp: -5, hours: 200 },
    { temp: 0, hours: 240 },
    { temp: 5, hours: 280 },
    { temp: 10, hours: 220 },
    { temp: 15, hours: 155 },
    { temp: 20, hours: 0 },
    { temp: 25, hours: 0 }
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      }
      
      // 城市联动更新能源价格
      if (field === 'city') {
        const cityData = cityEnergyPrices.find(c => c.city === value)
        if (cityData) {
          newData.gas_price = cityData.gas_price.toString()
          newData.elec_price = cityData.elec_price.toString()
        }
      }
      
      // 热泵类型联动更新参数
      if (field === 'hp_type') {
        const hpData = hpChillerDB.find(hp => hp.type === value)
        if (hpData) {
          newData.hp_capacity = hpData.min_capacity.toString()
          newData.heat_cop = hpData.heat_cop_45.toString()
          newData.cool_cop = hpData.cool_cop.toString()
          newData.price_per_kw = hpData.price_per_kw.toString()
        }
      }
      
      // 热源类型联动更新效率默认值
      if (field === 'exist_heat') {
        const efficiencyMap: { [key: string]: string } = {
          '燃气锅炉': '0.90',
          '燃煤锅炉': '0.75',
          '电锅炉': '0.96',
          '柴油锅炉': '0.88',
          '蒸汽管网': '0.85'
        }
        if (efficiencyMap[value as string]) {
          newData.exist_efficiency = efficiencyMap[value as string]
        }
      }
      
      return newData
    })
  }

  // 加权COP计算函数
  const calculateWeightedCOP = (hpType: string, correctedCOP: number): number => {
    const tempCorrectionData = tempCorrection.find(tc => tc.hp_type === hpType)
    if (!tempCorrectionData) return correctedCOP

    let totalWeightedCOP = 0
    let totalHours = 0

    tempProfile.forEach(profile => {
      const tempKey = profile.temp.toString()
      const copAtTemp = tempCorrectionData.temps[tempKey] || correctedCOP
      totalWeightedCOP += copAtTemp * profile.hours
      totalHours += profile.hours
    })

    return totalHours > 0 ? totalWeightedCOP / totalHours : correctedCOP
  }

  const calculateResults = () => {
    setIsCalculating(true)
    
    setTimeout(() => {
      // 获取相关数据
      const area = parseFloat(formData.area) || 10000
      const heatIndicator = parseFloat(formData.heat_indicator) || 60
      const dhwLoad = parseFloat(formData.dhw_load) || 15
      const heatingDays = parseFloat(formData.heating_days) || 120
      const runtimePerDay = parseFloat(formData.runtime_per_day) || 12
      const winterLoadRatio = parseFloat(formData.winter_load_ratio) / 100 || 0.7
      const elecPrice = parseFloat(formData.elec_price) || 0.75
      const gasPrice = parseFloat(formData.gas_price) || 3.2

      // 1. 采暖设计负荷
      const designHeatLoad = Math.ceil((area * heatIndicator / 1000) / 5) * 5

      // 2. 年采暖需热量
      const annualHeatDemand = designHeatLoad * winterLoadRatio * heatingDays * runtimePerDay

      // 3. 年生活热水热量
      const annualDhwDemand = dhwLoad * 365 * runtimePerDay * winterLoadRatio

      // 4. 总热需求
      const totalHeatDemand = annualHeatDemand + annualDhwDemand

      // 5. 额定COP（用户输入）
      const ratedCOP = parseFloat(formData.heat_cop) || 2.5

      // 6. 修正后额定COP（无压缩机修正）
      const correctedCOP = ratedCOP

      // 8. 加权COP
      const climateData = parseInt(formData.climate_data) || 0
      const weightedCOP = climateData === 0 ? correctedCOP : calculateWeightedCOP(formData.hp_type, correctedCOP)

      // 9. 除霜系数
      const defrostFactor = formData.hp_type.includes('空气源') ? 1.05 : 1.0

      // 10. 年耗电量
      const annualElectricity = (totalHeatDemand / (weightedCOP / defrostFactor)) * 1.08

      // 11. 年电费
      const annualElecCost = annualElectricity * elecPrice

      // 12. 现有燃料量
      const refSystemData = refSystem.find(r => r.heat_source === formData.exist_heat) || refSystem[1]
      const userExistEfficiency = parseFloat(formData.exist_efficiency) || 0.90
      const existingFuelAmount = Math.ceil(totalHeatDemand / (userExistEfficiency * refSystemData.fuel_value) * 1000 / 3600)

      // 13. 现有年能源费
      let fuelPrice = gasPrice
      if (formData.exist_heat === '燃煤锅炉') fuelPrice = 3
      if (formData.exist_heat === '电锅炉') fuelPrice = elecPrice

      const existingEnergyCost = existingFuelAmount * fuelPrice

      // 14. 年节省费用
      const annualSavings = existingEnergyCost - annualElecCost

      // 15. 年节能量
      const annualEnergySavings = existingFuelAmount * refSystemData.fuel_value * 3600 / 1000 - annualElectricity * 3.6

      // 16. 年碳减排
      const gasCarbon = parseFloat(formData.gas_co2) || 2.16
      const elecCarbon = parseFloat(formData.elec_co2) || 0.858
      let existingCarbon = gasCarbon
      if (formData.exist_heat === '燃煤锅炉') existingCarbon = 2.86
      if (formData.exist_heat === '电锅炉') existingCarbon = elecCarbon

      const annualCO2Reduction = existingFuelAmount * existingCarbon - annualElectricity * elecCarbon

      // 17. 热泵容量
      const hpCapacity = Math.max(designHeatLoad, parseFloat(formData.hp_capacity) || 300)

      // 18. 初投资
      const initialInvestment = hpCapacity * (parseFloat(formData.price_per_kw) || 720)

      // 19. 投资回收期
      const paybackPeriod = annualSavings <= 0 ? 0 : initialInvestment / annualSavings

      // 20. 制冷附加节省
      const coolCOP = parseFloat(formData.cool_cop) || 2.7
      const coolingAdditionalSavings = formData.cooling_demand ? 
        designHeatLoad * 0.6 * 720 * (1/3 - 1/coolCOP) * elecPrice : 0

      const calculatedResult: HP_Result = {
        design_heat_load: designHeatLoad,
        annual_heat_demand: annualHeatDemand,
        annual_dhw_demand: annualDhwDemand,
        total_heat_demand: totalHeatDemand,
        rated_cop: ratedCOP,
        compressor_correction: 1.0,
        corrected_cop: correctedCOP,
        weighted_cop: weightedCOP,
        defrost_factor: defrostFactor,
        annual_electricity: annualElectricity,
        annual_elec_cost: annualElecCost,
        existing_fuel_amount: existingFuelAmount,
        existing_energy_cost: existingEnergyCost,
        annual_savings: annualSavings,
        annual_energy_savings: annualEnergySavings,
        annual_co2_reduction: annualCO2Reduction,
        hp_capacity: hpCapacity,
        initial_investment: initialInvestment,
        payback_period: paybackPeriod,
        cooling_additional_savings: coolingAdditionalSavings
      }

      setResult(calculatedResult)
      setIsCalculating(false)
      setShowResults(true)
    }, 2000)
  }

  if (showResults && result) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="space-y-6">
            {/* 面包屑导航 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Link href="/calculator" className="hover:text-blue-600 transition-colors">
                  计算器
                </Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/calculator/hvac" className="hover:text-blue-600 transition-colors">
                  暖通空调节能改造
                </Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/calculator/hvac/source" className="hover:text-blue-600 transition-colors">
                  冷热源侧
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium">热泵系统计算器</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium">计算结果</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowResults(false)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回输入
                </Button>
                <Link href="/calculator/hvac/source">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    返回冷热源侧
                  </Button>
                </Link>
              </div>
            </div>

            {/* 推荐改造方案 */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Zap className="w-6 h-6 text-green-600" />
                  推荐改造方案
                </CardTitle>
                <CardDescription>基于您的项目参数，为您推荐最优的热泵系统改造方案</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 text-green-700">推荐热泵配置</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">热泵类型:</span>
                        <span className="font-medium">{formData.hp_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">制热COP:</span>
                        <span className="font-medium">{formData.heat_cop}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">设备容量:</span>
                        <span className="font-medium">{result.hp_capacity.toFixed(0)} kW</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">加权COP:</span>
                        <span className="font-medium text-green-600">{result.weighted_cop.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3 text-blue-700">经济效益预测</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">年节省费用:</span>
                        <span className="font-medium text-green-600">¥{result.annual_savings.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">初投资:</span>
                        <span className="font-medium">¥{result.initial_investment.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">投资回收期:</span>
                        <span className="font-medium text-blue-600">{result.payback_period.toFixed(1)} 年</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">年碳减排:</span>
                        <span className="font-medium text-green-600">{(result.annual_co2_reduction/1000).toFixed(1)} tCO₂</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 核心计算结果 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {result.design_heat_load.toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-600">采暖设计负荷 (kW)</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {result.weighted_cop.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">加权COP</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    ¥{(result.annual_savings/10000).toFixed(1)}万
                  </div>
                  <div className="text-sm text-gray-600">年节省费用</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {result.payback_period.toFixed(1)}年
                  </div>
                  <div className="text-sm text-gray-600">投资回收期</div>
                </CardContent>
              </Card>
            </div>

            {/* 详细计算结果 */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-red-500" />
                    热负荷分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">采暖设计负荷</span>
                      <span className="font-medium">{result.design_heat_load.toFixed(0)} kW</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">年采暖需热量</span>
                      <span className="font-medium">{(result.annual_heat_demand/10000).toFixed(1)} 万kWh</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">年生活热水热量</span>
                      <span className="font-medium">{(result.annual_dhw_demand/10000).toFixed(1)} 万kWh</span>
                    </div>
                    <div className="flex justify-between py-2 font-medium text-blue-600">
                      <span>总热需求</span>
                      <span>{(result.total_heat_demand/10000).toFixed(1)} 万kWh</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-500" />
                    性能参数
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">额定COP</span>
                      <span className="font-medium">{result.rated_cop.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">压缩机修正系数</span>
                      <span className="font-medium">{result.compressor_correction.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">修正后COP</span>
                      <span className="font-medium">{result.corrected_cop.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 font-medium text-green-600">
                      <span>加权COP</span>
                      <span>{result.weighted_cop.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 能耗对比 */}
            <Card>
              <CardHeader>
                <CardTitle>能耗与经济效益对比</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 text-red-700">现有系统 ({formData.exist_heat})</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">系统效率:</span>
                        <span>{formData.exist_efficiency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">年燃料消耗:</span>
                        <span>{result.existing_fuel_amount.toFixed(0)} {refSystem.find(r => r.heat_source === formData.exist_heat)?.unit || 'Nm³'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">年运行费用:</span>
                        <span className="text-red-600">¥{result.existing_energy_cost.toFixed(0)}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3 text-green-700">热泵系统</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">年耗电量:</span>
                        <span>{(result.annual_electricity/10000).toFixed(1)} 万kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">年运行费用:</span>
                        <span className="text-green-600">¥{result.annual_elec_cost.toFixed(0)}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3 text-blue-700">节能效果</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">年节省费用:</span>
                        <span className="text-blue-600 font-medium">¥{result.annual_savings.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">年节能量:</span>
                        <span className="font-medium">{(result.annual_energy_savings/1000).toFixed(1)} GJ</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 操作按钮 */}
            <div className="flex flex-wrap gap-3 justify-center">
              <Button onClick={() => setShowResults(false)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                重新计算
              </Button>
              <Button variant="outline">
                <Calculator className="w-4 h-4 mr-2" />
                生成详细报告
              </Button>
              <Button variant="outline">
                导出Excel
              </Button>
              <Link href="/products" target="_blank">
                <Button variant="outline">
                  推荐产品详情
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-6">
          {/* 面包屑导航 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/calculator" className="hover:text-blue-600 transition-colors">
                计算器
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/calculator/hvac" className="hover:text-blue-600 transition-colors">
                暖通空调节能改造
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/calculator/hvac/source" className="hover:text-blue-600 transition-colors">
                冷热源侧
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">热泵系统计算器</span>
            </div>
            <Link href="/calculator/hvac/source">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回冷热源侧
              </Button>
            </Link>
          </div>

          {/* 页面标题 */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">热泵系统计算器</h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              专业的热泵系统节能改造计算工具，支持多种热泵类型、环境温度修正、压缩机性能优化
            </p>
          </div>

          {/* 流程指示器 */}
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-center space-x-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <span>项目参数</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <span>热泵选型</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <span>性能修正</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                  <span>计算结果</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 输入表单 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 基本项目参数 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  基本项目参数
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>建筑类型</Label>
                    <Select value={formData.building_type} onValueChange={(value) => handleInputChange('building_type', value)}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="办公楼">办公楼</SelectItem>
                        <SelectItem value="酒店">酒店</SelectItem>
                        <SelectItem value="医院">医院</SelectItem>
                        <SelectItem value="学校">学校</SelectItem>
                        <SelectItem value="住宅">住宅</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>城市</Label>
                    <Select value={formData.city} onValueChange={(value) => handleInputChange('city', value)}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="北京">北京</SelectItem>
                        <SelectItem value="上海">上海</SelectItem>
                        <SelectItem value="哈尔滨">哈尔滨</SelectItem>
                        <SelectItem value="广州">广州</SelectItem>
                        <SelectItem value="成都">成都</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>需求类型</Label>
                  <Select value={formData.demand_type} onValueChange={(value) => handleInputChange('demand_type', value)}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="采暖">采暖</SelectItem>
                      <SelectItem value="采暖+制冷">采暖+制冷</SelectItem>
                      <SelectItem value="采暖+生活热水">采暖+生活热水</SelectItem>
                      <SelectItem value="三者都有">三者都有</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>现有热源</Label>
                    <Select value={formData.exist_heat} onValueChange={(value) => handleInputChange('exist_heat', value)}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="燃煤锅炉">燃煤锅炉</SelectItem>
                        <SelectItem value="燃气锅炉">燃气锅炉</SelectItem>
                        <SelectItem value="电锅炉">电锅炉</SelectItem>
                        <SelectItem value="柴油锅炉">柴油锅炉</SelectItem>
                        <SelectItem value="蒸汽管网">蒸汽管网</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      系统效率 (η)
                      <div className="w-2 h-2 bg-orange-500 rounded-full" title="根据热源类型自动设置"></div>
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.1"
                      max="1.0"
                      value={formData.exist_efficiency}
                      onChange={(e) => handleInputChange('exist_efficiency', e.target.value)}
                      className="h-8"
                      placeholder="0.90"
                    />
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  典型效率：燃气锅炉 0.85-0.95，燃煤锅炉 0.70-0.85，电锅炉 0.95-0.98
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>建筑面积 (㎡)</Label>
                    <Input
                      type="number"
                      value={formData.area}
                      onChange={(e) => handleInputChange('area', e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>采暖热指标 (W/㎡)</Label>
                    <Input
                      type="number"
                      value={formData.heat_indicator}
                      onChange={(e) => handleInputChange('heat_indicator', e.target.value)}
                      className="h-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>生活热水负荷 (kW)</Label>
                  <Input
                    type="number"
                    value={formData.dhw_load}
                    onChange={(e) => handleInputChange('dhw_load', e.target.value)}
                    className="h-8"
                  />
                </div>
              </CardContent>
            </Card>

            {/* 运行参数 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  运行参数
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>采暖期天数 (天)</Label>
                    <Input
                      type="number"
                      value={formData.heating_days}
                      onChange={(e) => handleInputChange('heating_days', e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>每日运行时 (h)</Label>
                    <Input
                      type="number"
                      value={formData.runtime_per_day}
                      onChange={(e) => handleInputChange('runtime_per_day', e.target.value)}
                      className="h-8"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>冬季平均负载 (%)</Label>
                    <Input
                      type="number"
                      value={formData.winter_load_ratio}
                      onChange={(e) => handleInputChange('winter_load_ratio', e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>夏季负载比 (%)</Label>
                    <Input
                      type="number"
                      value={formData.summer_load_ratio}
                      onChange={(e) => handleInputChange('summer_load_ratio', e.target.value)}
                      className="h-8"
                    />
                  </div>
                </div>


                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      燃气价格 (元/Nm³)
                      <div className="w-2 h-2 bg-blue-500 rounded-full" title="根据城市自动匹配"></div>
                    </Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.gas_price}
                      onChange={(e) => handleInputChange('gas_price', e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      电价 (元/kWh)
                      <div className="w-2 h-2 bg-blue-500 rounded-full" title="根据城市自动匹配"></div>
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.elec_price}
                      onChange={(e) => handleInputChange('elec_price', e.target.value)}
                      className="h-8"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 热泵选型 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  热泵选型
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>热泵类别</Label>
                  <Select value={formData.hp_type} onValueChange={(value) => handleInputChange('hp_type', value)}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="空气源热泵（常温）">空气源热泵（常温）</SelectItem>
                      <SelectItem value="空气源热泵（低温）">空气源热泵（低温）</SelectItem>
                      <SelectItem value="水源/地源热泵">水源/地源热泵</SelectItem>
                      <SelectItem value="污水源热泵">污水源热泵</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>设备容量 (kW)</Label>
                    <Input
                      type="number"
                      value={formData.hp_capacity}
                      onChange={(e) => handleInputChange('hp_capacity', e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>制热COP</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.heat_cop}
                      onChange={(e) => handleInputChange('heat_cop', e.target.value)}
                      className="h-8"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>制冷COP</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.cool_cop}
                      onChange={(e) => handleInputChange('cool_cop', e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>价格 (元/kW)</Label>
                    <Input
                      type="number"
                      value={formData.price_per_kw}
                      onChange={(e) => handleInputChange('price_per_kw', e.target.value)}
                      className="h-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>计算模式</Label>
                  <Select value={formData.climate_data} onValueChange={(value) => handleInputChange('climate_data', value)}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">粗算</SelectItem>
                      <SelectItem value="1">精算</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* 计算按钮 */}
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                执行计算
              </CardTitle>
              <CardDescription>
                基于专业热泵性能模型和环境温度修正的精确计算
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                {isCalculating ? (
                  <div className="space-y-4">
                    <div className="flex justify-center space-x-2">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600">正在计算热泵系统性能参数...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-600 mb-4">
                      请确认以上参数设置，点击开始计算
                    </p>
                    <Button 
                      onClick={calculateResults}
                      size="lg"
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    >
                      <Calculator className="w-5 h-5 mr-2" />
                      开始计算
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 计算逻辑说明 */}
          <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                <div className="w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-xs font-bold">📊</div>
                计算逻辑说明与公式
              </CardTitle>
              <p className="text-gray-600 text-sm">热泵系统节能改造计算的理论依据和技术标准</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 计算流程 */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">1</span>
                  热负荷计算
                </h4>
                <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
                  <div className="text-sm space-y-1">
                    <div><strong>设计热负荷:</strong> Q_design = A × q × K_city × K_building</div>
                    <div className="text-gray-600 ml-4">
                      其中：A = 建筑面积(m²), q = 热指标(W/m²), K_city = 城市修正系数, K_building = 建筑修正系数
                    </div>
                    <div className="mt-2"><strong>年热需求:</strong> Q_annual = Q_design × T_heating × T_daily × η_load</div>
                    <div className="text-gray-600 ml-4">
                      其中：T_heating = 采暖天数, T_daily = 日运行小时, η_load = 平均负荷率
                    </div>
                  </div>
                </div>
              </div>

              {/* COP计算 */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">2</span>
                  能效比(COP)计算
                </h4>
                <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
                  <div className="text-sm space-y-1">
                    <div><strong>加权COP:</strong> COP_weighted = Σ(COP_i × h_i / Σh_i)</div>
                    <div className="text-gray-600 ml-4">
                      其中：COP_i = 各温度段COP值, h_i = 对应温度段运行小时数
                    </div>
                    <div className="mt-2"><strong>除霜修正:</strong> COP_final = COP_weighted × η_defrost</div>
                    <div className="text-gray-600 ml-4">
                      其中：η_defrost = 除霜效率系数(0.85-0.95)
                    </div>
                  </div>
                </div>
              </div>

              {/* 能耗计算 */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs">3</span>
                  能耗与成本计算
                </h4>
                <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
                  <div className="text-sm space-y-1">
                    <div><strong>热泵年耗电:</strong> E_hp = Q_annual / COP_final</div>
                    <div><strong>热泵年电费:</strong> C_hp = E_hp × P_elec</div>
                    <div><strong>原系统年耗能:</strong> E_old = Q_annual / η_user</div>
                    <div className="text-gray-600 ml-4">
                      其中：η_user = 用户输入的原系统效率值
                    </div>
                    <div><strong>原系统年费用:</strong> C_old = E_old × P_fuel</div>
                    <div className="mt-2 text-blue-600"><strong>年节省费用:</strong> ΔC = C_old - C_hp</div>
                  </div>
                </div>
              </div>

              {/* 投资回收期 */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs">4</span>
                  投资回收期计算
                </h4>
                <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
                  <div className="text-sm space-y-1">
                    <div><strong>初投资:</strong> I = Q_hp × P_unit</div>
                    <div className="text-gray-600 ml-4">
                      其中：Q_hp = 热泵容量(kW), P_unit = 单位价格(元/kW)
                    </div>
                    <div className="mt-2 text-green-600"><strong>投资回收期:</strong> T_payback = I / ΔC (年)</div>
                    <div className="text-gray-600 ml-4">
                      当 ΔC ≤ 0 时，投资回收期 = 0（不经济）
                    </div>
                  </div>
                </div>
              </div>

              {/* 碳减排计算 */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">5</span>
                  碳减排计算
                </h4>
                <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
                  <div className="text-sm space-y-1">
                    <div><strong>原系统碳排放:</strong> CO2_old = E_old × EF_old</div>
                    <div><strong>热泵系统碳排放:</strong> CO2_hp = E_hp × EF_elec</div>
                    <div className="mt-2 text-green-600"><strong>年碳减排:</strong> ΔCO2 = CO2_old - CO2_hp (tCO₂)</div>
                    <div className="text-gray-600 ml-4">
                      其中：EF_old = 原燃料排放因子, EF_elec = 电网排放因子(0.858 kgCO₂/kWh)
                    </div>
                  </div>
                </div>
              </div>

              {/* 技术标准 */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">📋 技术标准与数据来源</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>• <strong>GB 50736-2012</strong> 《民用建筑供暖通风与空气调节设计规范》</div>
                  <div>• <strong>GB 50189-2015</strong> 《公共建筑节能设计标准》</div>
                  <div>• <strong>JGJ 142-2012</strong> 《辐射供暖供冷技术规程》</div>
                  <div>• <strong>《2023中国建筑节能年度发展报告》</strong> 运行数据</div>
                  <div>• <strong>各地节能中心实测数据</strong> 热泵性能参数</div>
                </div>
              </div>

              {/* 注意事项 */}
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">⚠️ 计算说明与注意事项</h4>
                <div className="text-sm text-yellow-700 space-y-1">
                  <div>• 计算结果仅供参考，实际工程需考虑具体环境条件和设备特性</div>
                  <div>• 热泵COP值会随环境温度变化，建议采用加权平均计算</div>
                  <div>• 除霜效率系数根据气候条件和设备类型确定，寒冷地区取值偏低</div>
                  <div>• 投资回收期未考虑设备维护成本和价格波动因素</div>
                  <div>• 碳减排计算基于全国电网平均排放因子，实际值可能因地区而异</div>
                </div>
              </div>

            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}