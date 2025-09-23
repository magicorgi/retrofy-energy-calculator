'use client'

import React, { useState } from 'react'
import { Metadata } from "next"
import Link from "next/link"
import { ChevronRight, ArrowLeft, Calculator, Thermometer, Factory, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// 数据接口定义
interface InputData {
  project_code: string
  project_name: string
  region: string
  scenario: string
  design_heating: string
  annual_hours: string
  load_factor: string
  original_system: string
  original_efficiency: string
  equipment_investment: string
  industrial_price: string
  gas_price: string
  carbon_price: string
  discount_rate: string
}

interface RegionData {
  region: string
  winter_temp: number
  elec_price: number
  gas_price: number
  cop_correction: number
  subsidy_ratio: number
  carbon_price: number
}

interface ScenarioData {
  scenario: string
  process_temp: number
  recommended_cop: number
  annual_hours: number
  load_factor: number
  waste_heat_recovery: boolean
  payback_period: number
}

interface HeatPumpData {
  refrigerant: string
  evap_temp: number
  cond_temp: number
  subcool: number
  superheat: number
  vfd_low: number
  plf: number
  carnot_cop: number
  isentropic_eff: number
  mechanical_eff: number
  heat_loss_eff: number
  calc_cop: number
  rated_heating: number
  unit_price: number
  package_factor: number
  region_factor: number
  subsidy_ratio: number
  equipment_investment: number
  rated_power: number
}

interface CalcResult {
  winter_temp: number
  cop_correction: number
  process_temp: number
  corrected_cop: number
  actual_investment: number
  original_energy: number
  heatpump_electricity: number
  annual_savings: number
  gas_consumption: number
  annual_energy_savings: number
  annual_maintenance: number
  annual_net_savings: number
  payback_period: number
  npv_10year: number
  irr: number
  co2_reduction: number
  carbon_income: number
}

export default function IndustrialHeatPumpCalculatorPage() {
  const [showResults, setShowResults] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState<CalcResult | null>(null)

  // 地区数据库
  const regionDB: RegionData[] = [
    { region: '华北', winter_temp: -2, elec_price: 0.85, gas_price: 3.2, cop_correction: 0.95, subsidy_ratio: 0.15, carbon_price: 60 },
    { region: '华东', winter_temp: 5, elec_price: 0.9, gas_price: 3.5, cop_correction: 1.00, subsidy_ratio: 0.15, carbon_price: 55 },
    { region: '华南', winter_temp: 15, elec_price: 0.8, gas_price: 3.8, cop_correction: 1.05, subsidy_ratio: 0.10, carbon_price: 50 },
    { region: '西南', winter_temp: 8, elec_price: 0.7, gas_price: 3.0, cop_correction: 1.02, subsidy_ratio: 0.12, carbon_price: 45 },
    { region: '东北', winter_temp: -12, elec_price: 0.75, gas_price: 3.1, cop_correction: 0.90, subsidy_ratio: 0.20, carbon_price: 65 },
  ]

  // 场景数据库
  const scenarioDB: ScenarioData[] = [
    { scenario: '食品杀菌-巴氏', process_temp: 85, recommended_cop: 3.5, annual_hours: 4000, load_factor: 0.8, waste_heat_recovery: true, payback_period: 2.3 },
    { scenario: '罐头杀菌', process_temp: 120, recommended_cop: 2.8, annual_hours: 3500, load_factor: 0.75, waste_heat_recovery: true, payback_period: 2.0 },
    { scenario: '化工反应釜', process_temp: 130, recommended_cop: 2.5, annual_hours: 5000, load_factor: 0.85, waste_heat_recovery: true, payback_period: 3.1 },
    { scenario: '造纸干燥', process_temp: 150, recommended_cop: 2.2, annual_hours: 6000, load_factor: 0.9, waste_heat_recovery: true, payback_period: 3.8 },
    { scenario: '纺织染整', process_temp: 110, recommended_cop: 3.0, annual_hours: 4500, load_factor: 0.8, waste_heat_recovery: true, payback_period: 2.6 },
    { scenario: '中药提取', process_temp: 95, recommended_cop: 3.2, annual_hours: 3000, load_factor: 0.7, waste_heat_recovery: false, payback_period: 3.5 },
  ]

  // 默认数据
  const [inputData, setInputData] = useState<InputData>({
    project_code: 'Demo',
    project_name: '苏州食品厂',
    region: '华东',
    scenario: '食品杀菌-巴氏',
    design_heating: '300',
    annual_hours: '4000',
    load_factor: '0.8',
    original_system: '燃气锅炉',
    original_efficiency: '0.85',
    equipment_investment: '11.0',
    industrial_price: '0.9',
    gas_price: '3.5',
    carbon_price: '55',
    discount_rate: '0.08'
  })

  // 热泵参数
  const [heatPumpData, setHeatPumpData] = useState<HeatPumpData>({
    refrigerant: 'R1234ze',
    evap_temp: 15,
    cond_temp: 95,
    subcool: 3,
    superheat: 5,
    vfd_low: 30,
    plf: 0.95,
    carnot_cop: 0,
    isentropic_eff: 0.65,
    mechanical_eff: 0.96,
    heat_loss_eff: 0.98,
    calc_cop: 0,
    rated_heating: 300,
    unit_price: 2500,
    package_factor: 1.35,
    region_factor: 1.0,
    subsidy_ratio: 0.15,
    equipment_investment: 0,
    rated_power: 0
  })

  const handleInputChange = (field: string, value: string) => {
    setInputData(prev => {
      const newData = {
        ...prev,
        [field]: value
      }
      
      // 地区联动更新价格和参数
      if (field === 'region') {
        const regionData = regionDB.find(r => r.region === value)
        if (regionData) {
          newData.industrial_price = regionData.elec_price.toString()
          newData.gas_price = regionData.gas_price.toString()
          newData.carbon_price = regionData.carbon_price.toString()
        }
        // 同时更新热泵参数中的地区系数和补贴比例
        updateHeatPumpInvestment(newData)
      }
      
      // 场景联动更新参数
      if (field === 'scenario') {
        const scenarioData = scenarioDB.find(s => s.scenario === value)
        if (scenarioData) {
          newData.annual_hours = scenarioData.annual_hours.toString()
          newData.load_factor = scenarioData.load_factor.toString()
        }
      }
      
      // 原系统类型联动效率
      if (field === 'original_system') {
        const efficiencyMap: { [key: string]: string } = {
          '燃气锅炉': '0.85',
          '燃煤锅炉': '0.75',
          '电锅炉': '0.96',
          '燃油锅炉': '0.82',
          '蒸汽锅炉': '0.78'
        }
        if (efficiencyMap[value]) {
          newData.original_efficiency = efficiencyMap[value]
        }
      }
      
      // 设计制热量变化时更新投资
      if (field === 'design_heating') {
        updateHeatPumpInvestment(newData)
      }
      
      return newData
    })
  }

  // 更新热泵投资计算
  const updateHeatPumpInvestment = (inputData: InputData) => {
    const regionData = regionDB.find(r => r.region === inputData.region)
    if (regionData) {
      const designHeating = parseFloat(inputData.design_heating) || 300
      const unitPrice = heatPumpData.unit_price
      const packageFactor = heatPumpData.package_factor
      const regionFactor = regionData.cop_correction
      const subsidyRatio = regionData.subsidy_ratio
      
      const investment = designHeating * unitPrice * packageFactor * regionFactor * (1 - subsidyRatio) / 10000
      const safeInvestment = isNaN(investment) ? 0 : investment
      
      setInputData(prev => ({
        ...prev,
        equipment_investment: safeInvestment.toFixed(1)
      }))
      
      // 同时更新热泵参数
      setHeatPumpData(prev => ({
        ...prev,
        rated_heating: designHeating,
        region_factor: regionFactor,
        subsidy_ratio: subsidyRatio,
        equipment_investment: safeInvestment
      }))
    }
  }

  const handleHeatPumpChange = (field: string, value: string | number) => {
    setHeatPumpData(prev => {
      const newData = {
        ...prev,
        [field]: value
      }
      
      // 实时计算卡诺COP
      if (field === 'evap_temp' || field === 'cond_temp') {
        const carnotCOP = (newData.cond_temp + 273) / (newData.cond_temp - newData.evap_temp)
        newData.carnot_cop = isNaN(carnotCOP) ? 0 : carnotCOP
      }
      
      // 实时计算理论COP
      const calcCOP = newData.isentropic_eff * newData.mechanical_eff * newData.heat_loss_eff * newData.carnot_cop * newData.plf
      newData.calc_cop = isNaN(calcCOP) ? 0 : calcCOP
      
      // 更新额定制热量
      newData.rated_heating = parseFloat(inputData.design_heating) || 300
      
      // 计算设备投资
      const regionData = regionDB.find(r => r.region === inputData.region)
      if (regionData) {
        newData.region_factor = regionData.cop_correction
        newData.subsidy_ratio = regionData.subsidy_ratio
        newData.equipment_investment = newData.rated_heating * newData.unit_price * newData.package_factor * newData.region_factor * (1 - newData.subsidy_ratio) / 10000
        
        // 同时更新inputData中的设备投资
        setInputData(prev => ({
          ...prev,
          equipment_investment: newData.equipment_investment.toFixed(1)
        }))
      }
      
      // 计算设计功耗
      newData.rated_power = newData.calc_cop === 0 ? 0 : newData.rated_heating / newData.calc_cop
      if (isNaN(newData.rated_power)) newData.rated_power = 0
      
      return newData
    })
  }

  // 计算函数
  const calculateResults = () => {
    setIsCalculating(true)
    
    setTimeout(() => {
      const regionData = regionDB.find(r => r.region === inputData.region) || regionDB[1]
      const scenarioData = scenarioDB.find(s => s.scenario === inputData.scenario) || scenarioDB[0]
      
      // 基础参数
      const designHeating = parseFloat(inputData.design_heating) || 300
      const annualHours = parseFloat(inputData.annual_hours) || 4000
      const loadFactor = parseFloat(inputData.load_factor) || 0.8
      const originalEfficiency = parseFloat(inputData.original_efficiency) || 0.85
      const industrialPrice = parseFloat(inputData.industrial_price) || 0.9
      const gasPrice = parseFloat(inputData.gas_price) || 3.5
      const carbonPrice = parseFloat(inputData.carbon_price) || 55
      const discountRate = parseFloat(inputData.discount_rate) || 0.08
      
      // 温度修正COP
      const winterTemp = regionData.winter_temp
      const processTemp = scenarioData.process_temp
      const correctedCOP = heatPumpData.calc_cop * 
        (1 + 0.01 * (winterTemp - 10)) * 
        (1 - 0.015 * Math.max(0, processTemp - 80))
      
      // 能耗计算
      const originalEnergy = designHeating * annualHours * loadFactor / originalEfficiency
      const heatpumpElectricity = designHeating * annualHours * loadFactor / correctedCOP * 1.12
      const annualSavingsEnergy = originalEnergy - heatpumpElectricity
      
      // 燃气消耗量
      const gasConsumption = originalEnergy / 11.06
      
      // 经济计算
      const annualEnergySavings = (gasConsumption * gasPrice - heatpumpElectricity * industrialPrice) / 10000
      const actualInvestment = heatPumpData.equipment_investment
      const annualMaintenance = actualInvestment * 0.02
      const annualNetSavings = annualEnergySavings - annualMaintenance
      const paybackPeriod = actualInvestment / annualNetSavings
      
      // NPV和IRR计算
      const cashFlows = [-actualInvestment]
      for (let i = 0; i < 10; i++) {
        cashFlows.push(annualNetSavings)
      }
      
      // 简化NPV计算
      let npv = -actualInvestment
      for (let i = 1; i <= 10; i++) {
        npv += annualNetSavings / Math.pow(1 + discountRate, i)
      }
      
      // 简化IRR计算（近似值）
      const irr = annualNetSavings / actualInvestment - 0.02
      
      // 碳排放计算
      const gasEmissionFactor = 0.1958
      const elecEmissionFactor = 0.5701
      const co2Reduction = (gasConsumption * gasEmissionFactor - heatpumpElectricity * elecEmissionFactor) / 1000
      const carbonIncome = co2Reduction * carbonPrice / 10000
      
      const calculatedResult: CalcResult = {
        winter_temp: winterTemp,
        cop_correction: regionData.cop_correction,
        process_temp: processTemp,
        corrected_cop: correctedCOP,
        actual_investment: actualInvestment,
        original_energy: originalEnergy,
        heatpump_electricity: heatpumpElectricity,
        annual_savings: annualSavingsEnergy,
        gas_consumption: gasConsumption,
        annual_energy_savings: annualEnergySavings,
        annual_maintenance: annualMaintenance,
        annual_net_savings: annualNetSavings,
        payback_period: paybackPeriod,
        npv_10year: npv,
        irr: irr,
        co2_reduction: co2Reduction,
        carbon_income: carbonIncome
      }
      
      setResult(calculatedResult)
      setIsCalculating(false)
      setShowResults(true)
    }, 2000)
  }

  // 初始化计算
  React.useEffect(() => {
    // 初始化卡诺COP计算
    const carnotCOP = (heatPumpData.cond_temp + 273) / (heatPumpData.cond_temp - heatPumpData.evap_temp)
    const calcCOP = heatPumpData.isentropic_eff * heatPumpData.mechanical_eff * heatPumpData.heat_loss_eff * carnotCOP * heatPumpData.plf
    
    setHeatPumpData(prev => ({
      ...prev,
      carnot_cop: isNaN(carnotCOP) ? 0 : carnotCOP,
      calc_cop: isNaN(calcCOP) ? 0 : calcCOP,
      rated_power: isNaN(calcCOP) || calcCOP === 0 ? 0 : prev.rated_heating / calcCOP
    }))
    
    // 初始化投资计算
    setTimeout(() => updateHeatPumpInvestment(inputData), 100)
  }, [])

  if (showResults && result) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="space-y-6">
            {/* Breadcrumbs and Back Button */}
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
                <span className="text-gray-900 font-medium">工业高温热泵计算器</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowResults(false)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回输入
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/calculator/hvac/source">
                    返回冷热源侧
                  </Link>
                </Button>
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">工业高温热泵计算结果</h1>
              <p className="text-gray-600 max-w-3xl mx-auto">
                基于{inputData.project_name}项目的{inputData.scenario}应用场景计算结果
              </p>
            </div>

            {/* 核心指标 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{result.corrected_cop.toFixed(2)}</div>
                  <div className="text-blue-100">修正COP</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{result.payback_period.toFixed(1)}年</div>
                  <div className="text-green-100">投资回收期</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{result.annual_energy_savings.toFixed(1)}万元</div>
                  <div className="text-purple-100">年省能源费</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{result.co2_reduction.toFixed(0)}吨</div>
                  <div className="text-orange-100">年CO₂减排</div>
                </CardContent>
              </Card>
            </div>

            {/* 详细结果 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 技术参数 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="w-5 h-5" />
                    技术参数
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">工艺温度:</span>
                    <span>{result.process_temp}℃</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">冬季平均气温:</span>
                    <span>{result.winter_temp}℃</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">理论COP:</span>
                    <span>{heatPumpData.calc_cop.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">修正后COP:</span>
                    <span className="font-semibold text-blue-600">{result.corrected_cop.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">设计制热量:</span>
                    <span>{inputData.design_heating} kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">设计功耗:</span>
                    <span>{heatPumpData.rated_power.toFixed(1)} kW</span>
                  </div>
                </CardContent>
              </Card>

              {/* 经济效益 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    经济效益
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">设备投资:</span>
                    <span>{result.actual_investment.toFixed(1)} 万元</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">年省能源费:</span>
                    <span className="text-green-600">{result.annual_energy_savings.toFixed(1)} 万元</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">年维护费:</span>
                    <span className="text-red-600">{result.annual_maintenance.toFixed(1)} 万元</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">年净节省:</span>
                    <span className="font-semibold text-green-600">{result.annual_net_savings.toFixed(1)} 万元</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">10年NPV:</span>
                    <span className="font-semibold">{result.npv_10year.toFixed(1)} 万元</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">内部收益率:</span>
                    <span>{(result.irr * 100).toFixed(1)}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 能耗对比 */}
            <Card>
              <CardHeader>
                <CardTitle>能耗与碳排放对比</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 text-red-700">原系统 ({inputData.original_system})</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">系统效率:</span>
                        <span>{inputData.original_efficiency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">年燃气消耗:</span>
                        <span>{result.gas_consumption.toFixed(0)} Nm³</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">年等效能耗:</span>
                        <span>{result.original_energy.toFixed(0)} kWh</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3 text-green-700">高温热泵系统</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">修正COP:</span>
                        <span>{result.corrected_cop.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">年总耗电:</span>
                        <span>{result.heatpump_electricity.toFixed(0)} kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">含辅电系数:</span>
                        <span>1.12</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3 text-blue-700">节能效果</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">年节能量:</span>
                        <span className="text-blue-600">{(result.original_energy - result.heatpump_electricity).toFixed(0)} kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">节能率:</span>
                        <span className="text-blue-600">{((result.original_energy - result.heatpump_electricity) / result.original_energy * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">年CO₂减排:</span>
                        <span className="text-green-600">{result.co2_reduction.toFixed(0)} 吨</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">碳交易收益:</span>
                        <span className="text-green-600">{result.carbon_income.toFixed(2)} 万元</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-6">
          {/* Breadcrumbs and Back Button */}
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
              <span className="text-gray-900 font-medium">工业高温热泵计算器</span>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/calculator/hvac/source">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回冷热源侧
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">工业高温热泵计算器</h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              专业的工业高温热泵节能改造计算与选型工具，支持85-150℃工艺温度应用场景。
            </p>
          </div>

          {/* 流程指示器 */}
          <Card className="text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm bg-gradient-to-r from-orange-50 to-red-50 border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-center space-x-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <span>项目参数</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <span>热泵配置</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <span>技术参数</span>
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
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* 1. 项目基本信息 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  项目基本信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>项目编号</Label>
                    <Input
                      value={inputData.project_code}
                      onChange={(e) => handleInputChange('project_code', e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>项目名称</Label>
                    <Input
                      value={inputData.project_name}
                      onChange={(e) => handleInputChange('project_name', e.target.value)}
                      className="h-8"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      地区
                      <div className="w-2 h-2 bg-blue-500 rounded-full" title="联动价格和修正系数"></div>
                    </Label>
                    <Select value={inputData.region} onValueChange={(value) => handleInputChange('region', value)}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="华北">华北</SelectItem>
                        <SelectItem value="华东">华东</SelectItem>
                        <SelectItem value="华南">华南</SelectItem>
                        <SelectItem value="西南">西南</SelectItem>
                        <SelectItem value="东北">东北</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      应用场景
                      <div className="w-2 h-2 bg-green-500 rounded-full" title="联动工艺温度和运行参数"></div>
                    </Label>
                    <Select value={inputData.scenario} onValueChange={(value) => handleInputChange('scenario', value)}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="食品杀菌-巴氏">食品杀菌-巴氏</SelectItem>
                        <SelectItem value="罐头杀菌">罐头杀菌</SelectItem>
                        <SelectItem value="化工反应釜">化工反应釜</SelectItem>
                        <SelectItem value="造纸干燥">造纸干燥</SelectItem>
                        <SelectItem value="纺织染整">纺织染整</SelectItem>
                        <SelectItem value="中药提取">中药提取</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>设计制热量 (kW)</Label>
                    <Input
                      type="number"
                      value={inputData.design_heating}
                      onChange={(e) => handleInputChange('design_heating', e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>年运行小时 (h)</Label>
                    <Input
                      type="number"
                      value={inputData.annual_hours}
                      onChange={(e) => handleInputChange('annual_hours', e.target.value)}
                      className="h-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>负荷率</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.1"
                    max="1.0"
                    value={inputData.load_factor}
                    onChange={(e) => handleInputChange('load_factor', e.target.value)}
                    className="h-8"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>原系统类型</Label>
                    <Select value={inputData.original_system} onValueChange={(value) => handleInputChange('original_system', value)}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="燃气锅炉">燃气锅炉</SelectItem>
                        <SelectItem value="燃煤锅炉">燃煤锅炉</SelectItem>
                        <SelectItem value="电锅炉">电锅炉</SelectItem>
                        <SelectItem value="燃油锅炉">燃油锅炉</SelectItem>
                        <SelectItem value="蒸汽锅炉">蒸汽锅炉</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      原系统效率
                      <div className="w-2 h-2 bg-orange-500 rounded-full" title="根据系统类型自动设置"></div>
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.1"
                      max="1.0"
                      value={inputData.original_efficiency}
                      onChange={(e) => handleInputChange('original_efficiency', e.target.value)}
                      className="h-8"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>工业电价 (元/kWh)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={inputData.industrial_price}
                      onChange={(e) => handleInputChange('industrial_price', e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>燃气价 (元/m³)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={inputData.gas_price}
                      onChange={(e) => handleInputChange('gas_price', e.target.value)}
                      className="h-8"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>碳交易价 (元/吨)</Label>
                    <Input
                      type="number"
                      value={inputData.carbon_price}
                      onChange={(e) => handleInputChange('carbon_price', e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>折现率 (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={(parseFloat(inputData.discount_rate) * 100).toString()}
                      onChange={(e) => handleInputChange('discount_rate', (parseFloat(e.target.value) / 100).toString())}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>设备投资 (万元)</Label>
                    <div className="text-xs text-gray-500">
                      将在热泵技术参数中设置
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. 热泵技术参数 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  热泵技术参数
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>工质类型</Label>
                  <Select value={heatPumpData.refrigerant} onValueChange={(value) => handleHeatPumpChange('refrigerant', value)}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="R1234ze">R1234ze</SelectItem>
                      <SelectItem value="R245fa">R245fa</SelectItem>
                      <SelectItem value="R1233zd">R1233zd</SelectItem>
                      <SelectItem value="R134a">R134a</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>蒸发温度 (℃)</Label>
                    <Input
                      type="number"
                      value={heatPumpData.evap_temp}
                      onChange={(e) => handleHeatPumpChange('evap_temp', parseFloat(e.target.value))}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>冷凝温度 (℃)</Label>
                    <Input
                      type="number"
                      value={heatPumpData.cond_temp}
                      onChange={(e) => handleHeatPumpChange('cond_temp', parseFloat(e.target.value))}
                      className="h-8"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>过冷度 (K)</Label>
                    <Input
                      type="number"
                      value={heatPumpData.subcool}
                      onChange={(e) => handleHeatPumpChange('subcool', parseFloat(e.target.value))}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>过热度 (K)</Label>
                    <Input
                      type="number"
                      value={heatPumpData.superheat}
                      onChange={(e) => handleHeatPumpChange('superheat', parseFloat(e.target.value))}
                      className="h-8"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>变频下限 (%)</Label>
                    <Input
                      type="number"
                      value={heatPumpData.vfd_low}
                      onChange={(e) => handleHeatPumpChange('vfd_low', parseFloat(e.target.value))}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>部分负荷系数</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={heatPumpData.plf}
                      onChange={(e) => handleHeatPumpChange('plf', parseFloat(e.target.value))}
                      className="h-8"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>等熵效率</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={heatPumpData.isentropic_eff}
                      onChange={(e) => handleHeatPumpChange('isentropic_eff', parseFloat(e.target.value))}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>机械效率</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={heatPumpData.mechanical_eff}
                      onChange={(e) => handleHeatPumpChange('mechanical_eff', parseFloat(e.target.value))}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>系统热损</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={heatPumpData.heat_loss_eff}
                      onChange={(e) => handleHeatPumpChange('heat_loss_eff', parseFloat(e.target.value))}
                      className="h-8"
                    />
                  </div>
                </div>

                {/* 计算结果显示 */}
                <div className="p-3 bg-green-50 rounded-lg text-sm">
                  <div className="font-medium text-green-900 mb-2">理论计算结果</div>
                  <div className="space-y-1 text-green-700">
                    <div>卡诺COP: {heatPumpData.carnot_cop.toFixed(2)}</div>
                    <div>理论COP: {heatPumpData.calc_cop.toFixed(2)}</div>
                    <div>设计功耗: {heatPumpData.rated_power.toFixed(1)} kW</div>
                  </div>
                </div>

                {/* 设备投资计算 */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="font-medium text-blue-900 mb-3">设备投资计算</div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="space-y-2">
                      <Label>热泵功率 (kW)</Label>
                      <Input
                        type="number"
                        value={heatPumpData.rated_heating}
                        onChange={(e) => handleHeatPumpChange('rated_heating', parseFloat(e.target.value))}
                        className="h-8"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>价格 (元/kW)</Label>
                      <Input
                        type="number"
                        value={heatPumpData.unit_price}
                        onChange={(e) => handleHeatPumpChange('unit_price', parseFloat(e.target.value))}
                        className="h-8"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                    <div>
                      <Label className="text-xs text-gray-600">打包系数</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={heatPumpData.package_factor}
                        onChange={(e) => handleHeatPumpChange('package_factor', parseFloat(e.target.value))}
                        className="h-7 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">地区系数</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={heatPumpData.region_factor}
                        readOnly
                        className="h-7 text-sm bg-gray-50"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">补贴比例</Label>
                      <div className="h-7 px-3 py-1 text-sm bg-gray-50 border rounded-md flex items-center">
                        {(heatPumpData.subsidy_ratio * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                  <div className="p-2 bg-blue-100 rounded text-sm">
                    <div className="font-medium text-blue-900 mb-1">计算公式</div>
                    <div className="text-blue-700 text-xs">
                      设备投资 = 热泵功率 × 价格/kW × 打包系数 × 地区系数 × (1 - 补贴比例) ÷ 10000
                    </div>
                    <div className="font-medium text-blue-900 mt-2">
                      设备投资: {heatPumpData.equipment_investment.toFixed(1)} 万元
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3. 参数预览和计算 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  参数预览
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 地区信息 */}
                {(() => {
                  const regionData = regionDB.find(r => r.region === inputData.region)
                  if (regionData) {
                    return (
                      <div className="p-3 bg-blue-50 rounded-lg text-sm">
                        <div className="font-medium text-blue-900 mb-2">{inputData.region}地区参数</div>
                        <div className="space-y-1 text-blue-700">
                          <div>冬季平均气温: {regionData.winter_temp}℃</div>
                          <div>COP修正系数: {regionData.cop_correction}</div>
                          <div>补贴比例: {(regionData.subsidy_ratio * 100).toFixed(0)}%</div>
                          <div>碳交易价: {regionData.carbon_price} 元/吨</div>
                        </div>
                      </div>
                    )
                  }
                  return null
                })()}

                {/* 场景信息 */}
                {(() => {
                  const scenarioData = scenarioDB.find(s => s.scenario === inputData.scenario)
                  if (scenarioData) {
                    return (
                      <div className="p-3 bg-orange-50 rounded-lg text-sm">
                        <div className="font-medium text-orange-900 mb-2">{inputData.scenario}场景</div>
                        <div className="space-y-1 text-orange-700">
                          <div>工艺温度: {scenarioData.process_temp}℃</div>
                          <div>推荐COP: {scenarioData.recommended_cop}</div>
                          <div>余热回收: {scenarioData.waste_heat_recovery ? '可用' : '不可用'}</div>
                          <div>参考回收期: {scenarioData.payback_period} 年</div>
                        </div>
                      </div>
                    )
                  }
                  return null
                })()}

                {/* 计算按钮 */}
                <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                      执行计算
                    </CardTitle>
                    <p className="text-gray-600 text-sm">基于工业高温热泵专业模型的精确计算</p>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center py-8">
                    <div className="text-center">
                      {isCalculating ? (
                        <div className="space-y-4">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                          <p className="text-gray-600">正在计算中...</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-gray-600 mb-4">请确认以上参数设置，点击开始计算</p>
                          <Button 
                            size="lg" 
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                            onClick={calculateResults}
                          >
                            <Calculator className="w-5 h-5 mr-2" />
                            开始计算
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>

          {/* 计算逻辑说明与公式 */}
          <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                <div className="w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-xs font-bold">📊</div>
                计算逻辑说明与公式
              </CardTitle>
              <p className="text-gray-600 text-sm">工业高温热泵系统节能改造计算的理论依据和技术标准</p>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* 1. 热泵COP计算 */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">1</span>
                  热泵COP计算
                </h4>
                <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
                  <div className="text-sm space-y-1">
                    <div><strong>卡诺COP:</strong> COP_carnot = (T_cond + 273) / (T_cond - T_evap)</div>
                    <div className="text-gray-600 ml-4">其中：T_cond = 冷凝温度(℃), T_evap = 蒸发温度(℃)</div>
                    <div className="mt-2"><strong>理论COP:</strong> COP_calc = η_is × η_mech × η_loss × COP_carnot × PLF</div>
                    <div className="text-gray-600 ml-4">
                      其中：η_is = 等熵效率, η_mech = 机械效率, η_loss = 系统热损, PLF = 部分负荷系数
                    </div>
                    <div className="mt-2"><strong>修正COP:</strong> COP_corrected = COP_calc × (1 + 0.01 × (T_winter - 10)) × (1 - 0.015 × max(0, T_process - 80))</div>
                    <div className="text-gray-600 ml-4">
                      其中：T_winter = 冬季平均气温(℃), T_process = 工艺温度(℃)
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. 设备投资计算 */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">2</span>
                  设备投资计算
                </h4>
                <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
                  <div className="text-sm space-y-1">
                    <div><strong>设备投资:</strong> I = Q_rated × P_unit × F_package × F_region × (1 - R_subsidy) ÷ 10000</div>
                    <div className="text-gray-600 ml-4">
                      其中：Q_rated = 热泵功率(kW), P_unit = 单价(元/kW), F_package = 打包系数(1.35), F_region = 地区系数, R_subsidy = 补贴比例
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. 能耗与成本计算 */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs">3</span>
                  能耗与成本计算
                </h4>
                <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
                  <div className="text-sm space-y-1">
                    <div><strong>原系统等效能耗:</strong> E_old = Q_design × H_annual × η_load / η_original</div>
                    <div><strong>热泵总耗电:</strong> E_hp = Q_design × H_annual × η_load / COP_corrected × 1.12</div>
                    <div className="text-gray-600 ml-4">其中：1.12为辅电系数（含水泵、风机等）</div>
                    <div><strong>燃气耗量:</strong> Gas = E_old / 11.06 (Nm³)</div>
                    <div className="text-gray-600 ml-4">其中：11.06为燃气热值转换系数</div>
                    <div className="mt-2 text-blue-600"><strong>年省能源费:</strong> ΔC = (Gas × P_gas - E_hp × P_elec) / 10000 (万元)</div>
                  </div>
                </div>
              </div>

              {/* 4. 财务分析 */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs">4</span>
                  财务分析
                </h4>
                <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
                  <div className="text-sm space-y-1">
                    <div><strong>年维护费:</strong> C_maintain = I × 0.02 (万元)</div>
                    <div><strong>年净节省:</strong> ΔC_net = ΔC - C_maintain (万元)</div>
                    <div><strong>投资回收期:</strong> T_payback = I / ΔC_net (年)</div>
                    <div className="mt-2"><strong>10年NPV:</strong> NPV = Σ(ΔC_net / (1 + r)^i) - I (万元)</div>
                    <div className="text-gray-600 ml-4">其中：r = 折现率, i = 年份(1-10)</div>
                    <div><strong>内部收益率:</strong> IRR ≈ ΔC_net / I - 0.02</div>
                  </div>
                </div>
              </div>

              {/* 5. 碳减排计算 */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">5</span>
                  碳减排计算
                </h4>
                <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
                  <div className="text-sm space-y-1">
                    <div><strong>原系统碳排放:</strong> CO2_old = Gas × EF_gas (tCO₂)</div>
                    <div><strong>热泵系统碳排放:</strong> CO2_hp = E_hp × EF_elec (tCO₂)</div>
                    <div className="mt-2 text-green-600"><strong>年碳减排:</strong> ΔCO2 = (CO2_old - CO2_hp) / 1000 (吨)</div>
                    <div className="text-gray-600 ml-4">
                      其中：EF_gas = 0.1958 kgCO₂/Nm³, EF_elec = 0.5701 kgCO₂/kWh
                    </div>
                    <div><strong>碳交易收益:</strong> C_carbon = ΔCO2 × P_carbon / 10000 (万元)</div>
                  </div>
                </div>
              </div>

              {/* 技术标准 */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">📋 技术标准与数据来源</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>• <strong>GB 50736-2012</strong> 《民用建筑供暖通风与空气调节设计规范》</div>
                  <div>• <strong>GB/T 25127-2010</strong> 《低环境温度空气源热泵(冷水)机组》</div>
                  <div>• <strong>JB/T 10973-2010</strong> 《容积式和离心式冷水(热泵)机组工况试验方法》</div>
                  <div>• <strong>《工业节能技术装备推荐目录》</strong> 高温热泵技术参数</div>
                  <div>• <strong>全国碳排放权交易市场</strong> 碳价格数据</div>
                </div>
              </div>

              {/* 注意事项 */}
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">⚠️ 计算说明与注意事项</h4>
                <div className="text-sm text-yellow-700 space-y-1">
                  <div>• 计算结果仅供参考，实际工程需考虑具体工艺条件和设备特性</div>
                  <div>• COP修正基于环境温度和工艺温度，实际运行中需要详细的性能曲线</div>
                  <div>• 设备投资包含主机、辅机、安装、运输等综合费用</div>
                  <div>• NPV和IRR计算基于固定现金流假设，实际项目需考虑运营风险</div>
                  <div>• 碳减排收益依赖于碳交易政策，存在价格波动风险</div>
                  <div>• 补贴政策因地区和时间而异，需要确认最新政策</div>
                </div>
              </div>

            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
