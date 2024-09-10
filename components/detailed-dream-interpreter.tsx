'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Moon, Sun, Star, AlertCircle, Heart, Briefcase, Coins, Activity } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const MAX_CHARS = 100
const MIN_CHARS = 10

type Interpretation = {
  general: string,
  love: string,
  career: string,
  wealth: string,
  health: string,
  advice: string,
  symbols: string[]
}

export default function DetailedDreamInterpreter() {
  const [dream, setDream] = useState('')
  const [charCount, setCharCount] = useState(0)
  const [interpretation, setInterpretation] = useState<Interpretation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setCharCount(dream.length)
    setError(null)
  }, [dream])

  const interpretDream = (dreamContent: string): Interpretation => {
    const keywords = {
      "飛": {
        general: "夢見飛翔，表示你渴望自由，希望擺脫現實的束縛。這個夢境反映了你內心對於超越限制的渴望。",
        love: "單身者可能很快遇到心儀的對象，有機會開始一段令人興奮的戀情。已有伴侶的人，感情會更加穩定，彼此的理解會加深。",
        career: "工作上可能會有新的機會，事業可能會有突破性的發展。你可能會接到一個重要的項目或得到晉升的機會。",
        wealth: "財運良好，可能會有意外之財。可以考慮進行一些合理的投資，但也要注意風險管理。",
        health: "身體狀況良好，心情愉悅。這種正面的心態會對你的整體健康產生積極影響。",
        advice: "保持樂觀積極的態度，勇於追求自己的夢想。同時，也要腳踏實地，一步一步實現自己的目標。",
        symbols: ["翅膀", "天空", "雲朵"]
      },
      "落下": {
        general: "夢見墜落，可能預示你在現實生活中感到不安或失控。這個夢境反映了你內心的恐懼和不安全感。",
        love: "感情方面可能會遇到一些挫折，需要更多的溝通和理解。可能會經歷一些誤會或爭執，但只要保持耐心和真誠，都能夠解決。",
        career: "工作上可能會遇到一些挑戰，需要保持冷靜和耐心。可能會面臨一些困難的決定或壓力較大的任務。",
        wealth: "財務方面需要謹慎，避免衝動消費或高風險投資。這段時間最好保守理財，避免不必要的開支。",
        health: "可能會感到壓力較大，需要多休息和放鬆。注意調節情緒，適當的運動可以幫助緩解壓力。",
        advice: "面對挑戰時保持冷靜，相信自己有能力克服困難。尋求親朋好友的支持和建議可能會有所幫助。",
        symbols: ["懸崖", "電梯", "飛機"]
      },
      "水": {
        general: "夢見水，象徵著情感和潛意識。水的狀態反映了你的情緒狀況。平靜的水代表內心平和，洶湧的水則可能意味著情緒波動。",
        love: "感情可能會有起伏，但總體來說會向好的方向發展。如果水是清澈的，可能預示感情純潔美好；如果是渾濁的，可能需要更多的坦誠和溝通。",
        career: "工作中可能會有一些變動，需要適應新的環境或任務。如同水的流動，保持靈活和適應性強的態度會對你有利。",
        wealth: "財運平穩，收支平衡。如同水的循環，財富也會有進有出，關鍵是要管理好現金流。",
        health: "注意情緒管理，保持心態平和。多喝水對身體有益，也可以考慮參加一些水上運動來放鬆身心。",
        advice: "學會像水一樣適應不同的環境，保持內心的平靜和柔軟。在面對變化時，保持靈活性和耐心。",
        symbols: ["河流", "海洋", "雨"]
      },
      "蛇": {
        general: "夢見蛇，可能象徵智慧、誘惑或潛在的威脅。蛇在不同文化中有不同的象徵意義，可能代表著轉變、治癒或隱藏的敵人。",
        love: "感情中可能會遇到第三者插足或面臨誘惑，需要提高警惕。另一方面，也可能預示感情關係將進入一個轉變期。",
        career: "工作中可能會遇到競爭對手或暗中使絆子的人，需要謹慎應對。同時，這也可能是一個自我提升和展現智慧的機會。",
        wealth: "財務方面可能會有意外支出，需要做好準備。也要警惕可能的金融詐騙或不明智的投資。",
        health: "可能會有小病小痛，注意飲食衛生。另外，這個夢境可能暗示你需要關注一些潛在的健康問題。",
        advice: "保持警惕，但不要過度猜疑。相信自己的直覺，在做重要決定時多加考慮。這可能是一個自我轉變和成長的好機會。",
        symbols: ["蛇皮", "毒藥", "變形"]
      },
      "房子": {
        general: "夢見房子，代表你的內心世界和個人空間。房子的狀態可能反映了你對自己生活現狀的看法。",
        love: "感情生活可能會有新的進展，可能會考慮同居或結婚。這個夢可能預示著你的感情關係正在走向更穩定和深入的階段。",
        career: "事業可能會有穩定發展，工作環境可能會改善。你可能會得到一個更好的辦公空間，或者在現有的工作中感到更加舒適。",
        wealth: "可能會考慮購置不動產，整體財運良好。這可能是一個適合投資房地產或改善居住條件的時期。",
        health: "身心都比較安定，注意保持良好的生活習慣。一個舒適的生活環境對你的健康有積極影響。",
        advice: "關注自己的生活空間，讓它更能反映你的個性和需求。同時，也要注意平衡個人空間和與他人的關係。",
        symbols: ["門", "窗戶", "屋頂"]
      }
    }

    let interpretation: Interpretation = {
      general: "你的夢境反映了你內心深處的想法和情感。每個元素都可能代表你生活中的某個方面或內心的某種渴望。",
      love: "感情方面可能會有一些變化，保持開放和真誠的態度。無論是否有伴侶，都要珍惜身邊的人，培養健康的關係。",
      career: "事業發展穩定，可能會有新的機會出現。保持學習的態度，提升自己的技能，為可能的機會做好準備。",
      wealth: "財運平穩，注意理性消費和投資。制定一個長期的財務計劃可能會對你有所幫助。",
      health: "整體健康狀況良好，但要注意作息規律。定期運動和均衡飲食對維持健康很重要。",
      advice: "傾聽你的內心聲音，但也要客觀分析現實情況。夢境可能揭示了你潛意識的想法，值得進一步思考和探索。",
      symbols: ["未知", "潛意識", "情感"]
    }

    let foundSymbols: string[] = []

    Object.entries(keywords).forEach(([key, value]) => {
      if (dreamContent.includes(key)) {
        interpretation = { ...interpretation, ...value }
        foundSymbols = foundSymbols.concat(value.symbols)
      }
    })

    interpretation.symbols = [...new Set(foundSymbols)]

    return interpretation
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (charCount < MIN_CHARS) {
      setError(`請至少輸入 ${MIN_CHARS} 個字。`)
      return
    }
    setIsLoading(true)
    setError(null)
    // 模擬API調用的延遲
    setTimeout(() => {
      const result = interpretDream(dream)
      setInterpretation(result)
      setIsLoading(false)
    }, 1500)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value
    if (input.length <= MAX_CHARS) {
      setDream(input)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center flex items-center justify-center">
          <Moon className="mr-2" />
          周公解夢
          <Star className="ml-2" />
        </CardTitle>
        <CardDescription className="text-center text-lg">
          描述你的夢境，讓我們為你揭示其中的奧秘（10-100字）
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder="詳細描述你的夢境內容..."
              value={dream}
              onChange={handleInputChange}
              className="w-full h-32 pr-16"
              maxLength={MAX_CHARS}
            />
            <div className="absolute bottom-2 right-2 text-sm text-muted-foreground">
              {charCount}/{MAX_CHARS}
            </div>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || charCount < MIN_CHARS || charCount > MAX_CHARS}
          >
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 正在解析...</> : '解夢'}
          </Button>
        </form>
      </CardContent>
      {interpretation && (
        <CardFooter className="flex flex-col items-start">
          <h3 className="text-xl font-semibold mb-2 flex items-center"><Sun className="mr-2" /> 夢境解析</h3>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="general">
              <AccordionTrigger>總體印象</AccordionTrigger>
              <AccordionContent>{interpretation.general}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="love">
              <AccordionTrigger className="flex items-center">
                <Heart className="mr-2 h-4 w-4" /> 愛情運勢
              </AccordionTrigger>
              <AccordionContent>{interpretation.love}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="career">
              <AccordionTrigger className="flex items-center">
                <Briefcase className="mr-2 h-4 w-4" /> 事業運勢
              </AccordionTrigger>
              <AccordionContent>{interpretation.career}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="wealth">
              <AccordionTrigger className="flex items-center">
                <Coins className="mr-2 h-4 w-4" /> 財富運勢
              </AccordionTrigger>
              <AccordionContent>{interpretation.wealth}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="health">
              <AccordionTrigger className="flex items-center">
                <Activity className="mr-2 h-4 w-4" /> 健康運勢
              </AccordionTrigger>
              <AccordionContent>{interpretation.health}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="advice">
              <AccordionTrigger>建議</AccordionTrigger>
              <AccordionContent>{interpretation.advice}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="symbols">
              <AccordionTrigger>夢境符號</AccordionTrigger>
              <AccordionContent>
                {interpretation.symbols.join(', ')}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardFooter>
      )}
    </Card>
  )
}