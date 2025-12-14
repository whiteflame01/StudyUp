import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Users,
  MessageCircle,
  Brain,
  ArrowRight,
  Zap,
  Shield,
  Activity,
  Target,
  Clock,
  Sparkles,
  TrendingUp,
  Globe,
  Lock,
} from 'lucide-react';

const scoringFeatures = [
  {
    icon: BookOpen,
    title: 'Content Overlap',
    description: "You aren't just both studying Physics; you are both reading the same specific quantum mechanics threads right now.",
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Activity,
    title: 'Learning Tempo',
    description: 'You both browse, pause, and engage at a similar rhythm.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    icon: Zap,
    title: 'Real-Time Intent',
    description: 'You are both active now and looking for the same depth of answers.',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
];

const techFeatures = [
  {
    icon: Brain,
    title: 'Behavioral Vectors',
    description: 'As you click, read, and linger on posts, our system builds a mathematical vector of your current interests.',
  },
  {
    icon: Target,
    title: 'Vector Alignment',
    description: 'We instantly compare your vector with thousands of other active students to find the highest mathematical overlap.',
  },
  {
    icon: TrendingUp,
    title: 'Context-Aware',
    description: 'The score changes as you change. If you switch from studying "Calculus" to "History," your Similarity Score updates instantly.',
  },
];

const collaborationFeatures = [
  {
    icon: Users,
    title: 'Suggested Connections',
    description: '"User_8492 has a 98% Similarity Score with you right now. Connect?"',
  },
  {
    icon: MessageCircle,
    title: 'Anonymous Chat',
    description: 'Start a conversation knowing you are already on the same page, without needing to break the ice.',
  },
  {
    icon: Globe,
    title: 'Ad-Hoc Groups',
    description: 'The system automatically groups users with high similarity scores into temporary "Study Rooms" for live discussion.',
  },
];

const whySimilarity = [
  {
    icon: Clock,
    title: 'Efficiency',
    description: "Don't waste time messaging 10 people hoping one knows the answer. The Similarity Score ensures they are already looking at the same material.",
  },
  {
    icon: Lock,
    title: 'Privacy',
    description: 'You connect based on ideas, not faces. This removes social anxiety and focuses purely on the work.',
  },
  {
    icon: Target,
    title: 'Accuracy',
    description: 'A "Junior in Computer Science" is a broad label. A "User currently reading about Dijkstra\'s Algorithm" is a precise match.',
  },
];

const scenarios = [
  {
    title: 'The Late Night Crammer',
    situation: "It's 2 AM. You are stuck on a specific Chemistry reaction.",
    match: "The algorithm finds another user with a 99% Similarity Score—they are currently reading the exact same chapter and looking at the same problem sets.",
    result: 'Instant collaboration. Problem solved.',
  },
  {
    title: 'The Niche Topic Explorer',
    situation: 'You are diving into an obscure historical event for a paper.',
    match: 'You match with a user who has a high Content Embedding Score for that specific topic, even though they are from a completely different university.',
    result: 'Deep discussion. Better paper.',
  },
];

export default function HomePage() {
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-purple-50/30">
      {/* Header - Sticky, Mobile-Optimized */}
      <header className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-md">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Study Up
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-sm">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="text-sm shadow-md">
                Start
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Mobile-First */}
      <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4 sm:mb-6 gap-1.5 text-xs sm:text-sm px-3 py-1.5">
            <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            AI-Powered Matching Engine
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
            Find Your
            <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              {' '}Academic Double.
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
            We don't match you based on your major or bio. We calculate a real-time{' '}
            <span className="font-semibold text-blue-600">Similarity Score</span> based on how you learn, 
            what you read, and how you solve problems. Find the study buddy who is actually on your wavelength.
          </p>
          
          {/* Primary CTAs - Stacked on Mobile */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 mb-8 sm:mb-12">
            <Link to="/buddies" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2 text-base font-semibold shadow-lg hover:shadow-xl h-12 sm:h-13">
                Calculate My Compatibility
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Live Score Demo - Mobile Optimized */}
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">You</span>
                </div>
                <div className="text-left">
                  <div className="text-xs text-gray-500">Currently studying</div>
                  <div className="font-semibold text-sm">Quantum Mechanics</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  98%
                </div>
                <div className="text-xs text-gray-500 font-medium">Match</div>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-4" />
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">U_8492</span>
              </div>
              <div className="text-left">
                <div className="text-xs text-gray-500">Also reading</div>
                <div className="font-semibold text-sm">Quantum Mechanics Ch. 3</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-500 mb-2">Behavioral overlap:</div>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">Same chapter</Badge>
                <Badge variant="secondary" className="text-xs">Similar pace</Badge>
                <Badge variant="secondary" className="text-xs">Active now</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Differentiator - Similarity Score Explanation */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 py-12 sm:py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              The "Similarity Score": How We Match You
            </h2>
            <p className="text-base sm:text-lg text-blue-100 max-w-3xl mx-auto leading-relaxed px-2">
              Traditional platforms match you because you both wrote "Biology" in a profile. That's not enough.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {scoringFeatures.map((feature, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-white text-lg sm:text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-blue-100 text-sm sm:text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <p className="text-lg sm:text-xl font-semibold text-white max-w-2xl mx-auto px-4">
              The Result? You are matched with someone who has a{' '}
              <span className="text-yellow-300 font-bold">95%+ Similarity Score</span> with your current session.
            </p>
          </div>
        </div>
      </section>

      {/* The Technology Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <Badge variant="secondary" className="mb-3 sm:mb-4">
            <Shield className="h-3 w-3 mr-1" />
            Privacy-First AI
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Deep Matching. Zero Personal Data.
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            Our recommendation engine builds a temporary "fingerprint" of your study habits to find your match.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {techFeatures.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-blue-300 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-3">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features for Collaboration */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Connect with High-Score Peers
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              Once the system identifies a high-compatibility match, we give you the tools to collaborate instantly.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {collaborationFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow border-0 shadow-md">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mb-3">
                    <feature.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm sm:text-base leading-relaxed italic">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why "Similarity" is Better */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Why "Similarity" is Better than "Identity"
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {whySimilarity.map((item, index) => (
            <Card key={index} className="border-2 border-blue-100 hover:border-blue-300 transition-all">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base leading-relaxed">
                  {item.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Real Student Scenarios */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Real Student Scenarios
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {scenarios.map((scenario, index) => (
              <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <Badge variant="secondary" className="text-xs">Live Match</Badge>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl">{scenario.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Situation</div>
                    <p className="text-sm sm:text-base text-gray-700">{scenario.situation}</p>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-1">The Match</div>
                    <p className="text-sm sm:text-base text-gray-700">{scenario.match}</p>
                  </div>
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-500" />
                      <span className="font-semibold text-green-700">{scenario.result}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 px-2">
            Stop studying with strangers.
            <br />
            Start studying with matches.
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Let our algorithm find the peers who think the way you do.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="gap-2 text-base sm:text-lg font-semibold h-12 sm:h-14 px-6 sm:px-10 shadow-2xl hover:shadow-3xl">
              Start Session & Find Matches
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">Study Up</span>
              </div>
              <p className="text-sm text-gray-400">
                AI-powered study matching for the modern student.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-3 text-sm">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/buddies" className="hover:text-white transition-colors">Find Matches</Link></li>
                <li><Link to="/sessions" className="hover:text-white transition-colors">Study Sessions</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-3 text-sm">Privacy</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy & Anonymity</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Data Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-3 text-sm">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 sm:pt-8 border-t border-gray-800 text-center">
            <p className="text-xs sm:text-sm text-gray-400">
              © {new Date().getFullYear()} Study Up. Built for students who want real connections, not random matches.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
