// src/components/EquityCalculator.tsx
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Investment {
  amount: number | ''
  description: string
}

interface Partner {
  name: string
  initialInvestment: number | ''
  investments: Investment[]
}

export function EquityCalculator() {
  const [partners, setPartners] = useState<Partner[]>([
    { name: 'Partner 1', initialInvestment: '', investments: [] },
    { name: 'Partner 2', initialInvestment: '', investments: [] },
  ])
  const [businessValue, setBusinessValue] = useState<number | ''>('')
  const [roundCount, setRoundCount] = useState(1)

  const addPartner = () => {
    setPartners([...partners, {
      name: `Partner ${partners.length + 1}`,
      initialInvestment: '',
      investments: []
    }])
  }

  const removePartner = (index: number) => {
    if (partners.length > 1) {
      setPartners(partners.filter((_, i) => i !== index))
    }
  }

  const addInvestmentRound = () => {
    setRoundCount(prev => prev + 1)
    setPartners(partners.map(partner => ({
      ...partner,
      investments: [...partner.investments, { amount: '', description: `Round ${roundCount + 1}` }]
    })))
  }

  const removeInvestmentRound = (roundIndex: number) => {
    setPartners(partners.map(partner => ({
      ...partner,
      investments: partner.investments.filter((_, i) => i !== roundIndex)
    })))
    setRoundCount(prev => prev - 1)
  }

  const updatePartner = (partnerIndex: number, field: keyof Partner | 'investment', value: string, roundIndex?: number) => {
    const newPartners = [...partners]
    if (field === 'name') {
      newPartners[partnerIndex].name = value
    } else if (field === 'initialInvestment') {
      newPartners[partnerIndex].initialInvestment = value === '' ? '' : parseFloat(value)
    } else if (field === 'investment' && roundIndex !== undefined) {
      newPartners[partnerIndex].investments[roundIndex].amount = value === '' ? '' : parseFloat(value)
    }
    setPartners(newPartners)
  }

  const updateRoundDescription = (roundIndex: number, description: string) => {
    setPartners(partners.map(partner => ({
      ...partner,
      investments: partner.investments.map((inv, i) =>
        i === roundIndex ? { ...inv, description } : inv
      )
    })))
  }

  const calculateShares = () => {
    const getTotalInvestment = (partner: Partner) => {
      const initial = typeof partner.initialInvestment === 'number' ? partner.initialInvestment : 0
      const additional = partner.investments.reduce((sum, inv) =>
        sum + (typeof inv.amount === 'number' ? inv.amount : 0), 0)
      return initial + additional
    }

    const totalInvestment = partners.reduce((sum, partner) => sum + getTotalInvestment(partner), 0)

    return partners.map(partner => {
      const totalContribution = getTotalInvestment(partner)
      const share = totalContribution === 0 ? 0 : (totalContribution / totalInvestment) * 100
      return {
        ...partner,
        share: share.toFixed(2),
        totalInvested: totalContribution
      }
    })
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Business Equity Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Business Value:</label>
            <Input
              type="number"
              placeholder="Enter current business value"
              value={businessValue}
              onChange={(e) => setBusinessValue(e.target.value === '' ? '' : parseFloat(e.target.value))}
            />
          </div>

          {partners.map((partner, partnerIndex) => (
            <div key={partnerIndex} className="p-4 border rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <Input
                  value={partner.name}
                  onChange={(e) => updatePartner(partnerIndex, 'name', e.target.value)}
                  className="max-w-[200px]"
                  placeholder="Partner name"
                />
                <Button
                  onClick={() => removePartner(partnerIndex)}
                  variant="destructive"
                  size="sm"
                >
                  Remove
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Initial Investment:</label>
                  <Input
                    type="number"
                    placeholder="Initial investment"
                    value={partner.initialInvestment}
                    onChange={(e) => updatePartner(partnerIndex, 'initialInvestment', e.target.value)}
                  />
                </div>

                {partner.investments.map((investment, roundIndex) => (
                  <div key={roundIndex} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
                    <div className="space-y-2">
                      <Input
                        placeholder="Round description"
                        value={investment.description}
                        onChange={(e) => updateRoundDescription(roundIndex, e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="number"
                        placeholder="Investment amount"
                        value={investment.amount}
                        onChange={(e) => updatePartner(partnerIndex, 'investment', e.target.value, roundIndex)}
                      />
                    </div>
                    {roundIndex === partner.investments.length - 1 && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeInvestmentRound(roundIndex)}
                        className="md:col-span-2"
                      >
                        Remove Round
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex gap-4">
            <Button onClick={addPartner} className="flex-1">
              Add Partner
            </Button>
            <Button onClick={addInvestmentRound} variant="outline" className="flex-1">
              Add Investment Round
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-lg">Equity Distribution</h3>
            <div className="space-y-2">
              {calculateShares().map((partner, index) => (
                <div key={index} className="flex justify-between p-3 bg-secondary rounded-lg">
                  <div className="space-y-1">
                    <span className="font-medium">{partner.name}</span>
                    <div className="text-sm text-muted-foreground">
                      Total Invested: {partner.totalInvested.toLocaleString()}
                    </div>
                  </div>
                  <span className="font-bold text-lg">{partner.share}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}