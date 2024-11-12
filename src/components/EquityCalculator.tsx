// src/components/EquityCalculator.tsx
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Partner {
  name: string
  initialInvestment: number
  newInvestment: number
}

export function EquityCalculator() {
  const [partners, setPartners] = useState<Partner[]>([
    { name: 'Partner 1', initialInvestment: 0, newInvestment: 0 },
    { name: 'Partner 2', initialInvestment: 0, newInvestment: 0 },
  ])
  const [businessValue, setBusinessValue] = useState<number>(0)

  const addPartner = () => {
    setPartners([...partners, {
      name: `Partner ${partners.length + 1}`,
      initialInvestment: 0,
      newInvestment: 0
    }])
  }

  const removePartner = (index: number) => {
    if (partners.length > 1) {
      setPartners(partners.filter((_, i) => i !== index))
    }
  }

  const updatePartner = (index: number, field: keyof Partner, value: string) => {
    const newPartners = [...partners]
    newPartners[index][field] = field === 'name' ? value : parseFloat(value) || 0
    setPartners(newPartners)
  }

  const calculateShares = () => {
    const totalInitialInvestment = partners.reduce((sum, p) => sum + p.initialInvestment, 0)
    const totalNewInvestment = partners.reduce((sum, p) => sum + p.newInvestment, 0)

    return partners.map(partner => {
      const totalContribution = partner.initialInvestment + partner.newInvestment
      const share = (totalContribution / (totalInitialInvestment + totalNewInvestment)) * 100
      return {
        ...partner,
        share: share.toFixed(2)
      }
    })
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
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
              onChange={(e) => setBusinessValue(parseFloat(e.target.value) || 0)}
            />
          </div>

          {partners.map((partner, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <Input
                  value={partner.name}
                  onChange={(e) => updatePartner(index, 'name', e.target.value)}
                  className="max-w-[200px]"
                />
                <Button
                  onClick={() => removePartner(index)}
                  variant="destructive"
                  size="sm"
                >
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Initial Investment:</label>
                  <Input
                    type="number"
                    value={partner.initialInvestment}
                    onChange={(e) => updatePartner(index, 'initialInvestment', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">New Investment:</label>
                  <Input
                    type="number"
                    value={partner.newInvestment}
                    onChange={(e) => updatePartner(index, 'newInvestment', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}

          <Button onClick={addPartner} className="w-full">
            Add Partner
          </Button>

          <div className="space-y-2">
            <h3 className="font-medium">Equity Distribution</h3>
            <div className="space-y-2">
              {calculateShares().map((partner, index) => (
                <div key={index} className="flex justify-between p-3 bg-secondary rounded-lg">
                  <span>{partner.name}</span>
                  <span className="font-medium">{partner.share}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}