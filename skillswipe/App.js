import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Animated, PanResponder, Dimensions, SafeAreaView, Alert, Modal, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const API = 'http://localhost:3000/api';
const { width } = Dimensions.get('window');
const C = { primary: '#6C63FF', bg: '#0F0F1A', card: '#1E1E2E', text: '#FFF', sub: '#A0A0B0', accent: '#FF6B9D', green: '#4CAF50' };
const ctx = React.createContext();

const call = async (path, method = 'GET', body, token) => {
  const r = await fetch(`${API}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
    body: body ? JSON.stringify(body) : undefined
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || 'Erro');
  return d;
};

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// ─── LOGIN 
function LoginScreen({ navigation }) {
  const [email, setE] = useState(''), [pass, setP] = useState('');
  const { setAuth } = React.useContext(ctx);
  const go = async () => {
    try { const { user, token } = await call('/login', 'POST', { email, password: pass }); setAuth({ user, token }); }
    catch (e) { Alert.alert('Erro', e.message); }
  };
  return (
    <SafeAreaView style={s.container}>
      <Text style={s.logo}>SkillSwipe</Text>
      <TextInput style={s.input} placeholder="Email" placeholderTextColor={C.sub} value={email} onChangeText={setE} autoCapitalize="none" />
      <TextInput style={s.input} placeholder="Senha" placeholderTextColor={C.sub} value={pass} onChangeText={setP} secureTextEntry />
      <TouchableOpacity style={s.btn} onPress={go}><Text style={s.btnTxt}>Entrar</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}><Text style={s.link}>Criar conta</Text></TouchableOpacity>
    </SafeAreaView>
  );
}

// ─── REGISTER 
function RegisterScreen({ navigation }) {
  const [name, setN] = useState(''), [email, setE] = useState(''), [pass, setP] = useState('');
  const { setAuth } = React.useContext(ctx);
  const go = async () => {
    try { const { user, token } = await call('/register', 'POST', { name, email, password: pass }); setAuth({ user, token }); }
    catch (e) { Alert.alert('Erro', e.message); }
  };
  return (
    <SafeAreaView style={s.container}>
      <Text style={s.logo}>Criar Conta</Text>
      <TextInput style={s.input} placeholder="Nome" placeholderTextColor={C.sub} value={name} onChangeText={setN} />
      <TextInput style={s.input} placeholder="Email" placeholderTextColor={C.sub} value={email} onChangeText={setE} autoCapitalize="none" />
      <TextInput style={s.input} placeholder="Senha" placeholderTextColor={C.sub} value={pass} onChangeText={setP} secureTextEntry />
      <TouchableOpacity style={s.btn} onPress={go}><Text style={s.btnTxt}>Registrar</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}><Text style={s.link}>Já tenho conta</Text></TouchableOpacity>
    </SafeAreaView>
  );
}

// ─── HOME — lista de trilhas com filtro por categoria 
function HomeScreen({ navigation }) {
  const [trails, setTrails] = useState([]);
  const [filter, setFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  const { auth } = React.useContext(ctx);

  useEffect(() => {
    (async () => {
      try {
        const data = await call('/trails');
        setTrails(data);
        setCategories([...new Set(data.map(t => t.category))]);
      } catch {}
    })();
  }, []);

  const filtered = filter === 'all' ? trails : trails.filter(t => t.category === filter);

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <View>
          <Text style={s.greeting}>Olá, {auth.user.name}!</Text>
          <Text style={s.xp}>⚡ {auth.user.total_xp || 0} XP · Nv {auth.user.current_level || 1}</Text>
        </View>
        <TouchableOpacity style={s.btnSmall} onPress={() => navigation.navigate('Stats')}>
          <Text style={s.btnTxt}>📊 Stats</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catScroll}>
        <TouchableOpacity style={[s.catPill, filter === 'all' && s.catActive]} onPress={() => setFilter('all')}>
          <Text style={[s.catText, filter === 'all' && s.catTextActive]}>Todas</Text>
        </TouchableOpacity>
        {categories.map(cat => (
          <TouchableOpacity key={cat} style={[s.catPill, filter === cat && s.catActive]} onPress={() => setFilter(cat)}>
            <Text style={[s.catText, filter === cat && s.catTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered} keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={[s.trail, { borderLeftColor: item.color_theme }]} onPress={() => navigation.navigate('Trail', { trail: item })}>
            <Text style={s.trailTitle}>{item.title}</Text>
            <Text style={s.trailDesc}>{item.description}</Text>
            <View style={s.tagRow}>
              <Text style={s.tag}>{item.category}</Text>
              <Text style={s.tag}>{item.total_cards} cards</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

// ─── TRAIL — busca apenas cards NÃO vistos e exibe com swipe 
function TrailScreen({ route, navigation }) {
  const { trail } = route.params;
  const { auth, setAuth } = React.useContext(ctx);
  const [cards, setCards] = useState([]);
  const [idx, setIdx] = useState(0);
  const [flip, setFlip] = useState(false);
  const [loading, setLoading] = useState(true);
  const [knownCount, setKnownCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [stats, setStats] = useState(null);
  const [noCardsLeft, setNoCardsLeft] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const pos = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setLoading(true); setIdx(0); setFlip(false); setKnownCount(0); setReviewCount(0);
    setNoCardsLeft(false); setSessionDone(false);
    (async () => {
      try {
        const data = await call(`/trails/${trail.id}/cards/new`, 'GET', null, auth.token);
        if (data.cards.length === 0) {
          setNoCardsLeft(true);
          setStats(data.stats);
        } else {
          setCards(shuffle(data.cards));
          setStats(data.stats);
        }
      } catch (e) { Alert.alert('Erro', e.message); }
      finally { setLoading(false); }
    })();
  }, [trail.id]);

  const pan = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, g) => pos.setValue(g.dx),
    onPanResponderRelease: (_, g) => {
      if (g.dx > 120) doSwipe('known');
      else if (g.dx < -120) doSwipe('review');
      else Animated.spring(pos, { toValue: 0, useNativeDriver: false }).start();
    }
  });

  const doSwipe = (action) => {
    if (idx >= cards.length) return;
    Animated.timing(pos, { toValue: action === 'known' ? width : -width, duration: 250, useNativeDriver: false }).start(async () => {
      try {
        const r = await call(`/cards/${cards[idx].id}/swipe`, 'POST', { action }, auth.token);
        setAuth({ ...auth, user: { ...auth.user, ...r.user } });
        
        if (action === 'known') {
          setKnownCount(c => c + 1);
          setIdx(i => i + 1);
          setFlip(false);
          pos.setValue(0);
          if (idx + 1 >= cards.length) {
            setSessionDone(true);
          }
        } else {
          setReviewCount(c => c + 1);
          // SRS Fallback: coloca o card no final da fila para rever nesta mesma sessão
          setCards(prev => [...prev, cards[idx]]);
          setIdx(i => i + 1);
          setFlip(false);
          pos.setValue(0);
        }
      } catch (e) { Alert.alert('Erro', e.message); pos.setValue(0); }
    });
  };

  const handleReset = async () => {
    try {
      await call(`/trails/${trail.id}/reset`, 'POST', null, auth.token);
      const data = await call(`/trails/${trail.id}/cards/new`, 'GET', null, auth.token);
      setCards(shuffle(data.cards || [])); setStats(data.stats);
      setNoCardsLeft(false); setIdx(0); setKnownCount(0); setReviewCount(0); setSessionDone(false);
      Alert.alert('✅', 'Progresso resetado! Todos os cards disponíveis novamente.');
    } catch (e) { Alert.alert('Erro', e.message); }
  };

  if (loading) return <SafeAreaView style={s.container}><Text style={s.logo}>Carregando...</Text></SafeAreaView>;

  // Tela: todos os cards já foram vistos
  if (noCardsLeft) return (
    <SafeAreaView style={s.container}>
      <Text style={s.logo}>🏆 Tudo visto!</Text>
      <View style={s.resultBox}>
        <Text style={s.resultLine}>📚 Você já estudou TODOS os {stats?.totalCards} cards</Text>
        <Text style={s.resultLine}>desta matéria. Parabéns!</Text>
        {stats?.dupCount > 0 && (
          <Text style={[s.resultLine, { color: C.accent, fontSize: 13, borderTopWidth: 1, borderTopColor: '#2A2A3E', paddingTop: 8, marginTop: 8 }]}>
            🔄 {stats.dupCount} duplicatas removidas automaticamente!
          </Text>
        )}
      </View>
      <Text style={s.subtitle}>Deseja resetar e estudar novamente?</Text>
      <TouchableOpacity style={[s.btn, { backgroundColor: C.accent }]} onPress={handleReset}>
        <Text style={s.btnTxt}>🔄 Resetar cards</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.btn} onPress={() => navigation.navigate('Home')}>
        <Text style={s.btnTxt}>Voltar ao início</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  // Tela: sessão concluída
  if (sessionDone) return (
    <SafeAreaView style={s.container}>
      <Text style={s.logo}>Sessão concluída! 🎉</Text>
      <View style={s.resultBox}>
        <Text style={s.resultLine}>✅ Você sabia: {knownCount}</Text>
        <Text style={s.resultLine}>📚 Para revisar: {reviewCount}</Text>
        <Text style={s.resultLine}>📊 Total desta sessão: {cards.length}</Text>
        <Text style={s.resultLine}>🔒 Cards novos restantes: {stats?.remaining - (cards.length - reviewCount)}</Text>
        {stats?.dupCount > 0 && (
          <Text style={[s.resultLine, { color: C.accent, fontSize: 13, borderTopWidth: 1, borderTopColor: '#2A2A3E', paddingTop: 8, marginTop: 8 }]}>
            🔄 {stats.dupCount} duplicatas removidas automaticamente!
          </Text>
        )}
      </View>
      <TouchableOpacity style={s.btn} onPress={() => navigation.navigate('Home')}>
        <Text style={s.btnTxt}>Voltar ao início</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  // Tela: swipe ativo
  const card = cards[idx];
  const rotate = pos.interpolate({ inputRange: [-width, 0, width], outputRange: ['-10deg', '0deg', '10deg'] });

  return (
    <SafeAreaView style={s.container}>
      <View style={s.trailHeader}>
        <Text style={s.title}>{trail.title}</Text>
        <Text style={s.counter}>{idx + 1}/{cards.length}</Text>
      </View>

      <View style={s.progressTrack}>
        <View style={[s.progressBar, { width: `${(idx / cards.length) * 100}%` }]} />
      </View>

      <View style={s.countRow}>
        <Text style={s.countKnown}>✅ {knownCount}</Text>
        <Text style={s.countReview}>📚 {reviewCount}</Text>
        <Text style={s.countRemain}>🔒 {stats?.remaining - cards.length}</Text>
      </View>

      <View style={s.cardArea}>
        <Animated.View {...pan.panHandlers} style={[s.card, { transform: [{ translateX: pos }, { rotate }] }]}>
          <TouchableOpacity activeOpacity={1} onPress={() => setFlip(!flip)} style={s.cardInner}>
            <Text style={s.cardLabel}>{flip ? 'Resposta' : 'Pergunta'}</Text>
            <Text style={s.cardText}>{flip ? card.back_content : card.front_content}</Text>
            <Text style={s.hint}>Toque para virar</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View style={s.swipeRow}>
        <TouchableOpacity style={[s.swipeBtn, { backgroundColor: '#3A2A4E' }]} onPress={() => doSwipe('review')}>
          <Text style={s.btnTxt}>← Revisar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.swipeBtn, { backgroundColor: C.primary }]} onPress={() => doSwipe('known')}>
          <Text style={s.btnTxt}>Sei! →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── STATS — estatísticas globais de cards vistos por matéria 
function StatsScreen({ navigation }) {
  const { auth } = React.useContext(ctx);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { setStats(await call('/stats/global', 'GET', null, auth.token)); }
      catch {} finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <SafeAreaView style={s.container}><Text style={s.logo}>Carregando...</Text></SafeAreaView>;

  return (
    <SafeAreaView style={s.container}>
      <Text style={s.logo}>Estatísticas</Text>
      <View style={s.resultBox}>
        <Text style={s.resultLine}>📊 Total de cards: {stats.totalCards}</Text>
        <Text style={s.resultLine}>✅ Já estudados: {stats.seenCards}</Text>
        <Text style={s.resultLine}>🔒 Não vistos: {stats.unseenCards}</Text>
      </View>
      <Text style={s.sectionTitle}>Por matéria:</Text>
      <FlatList
        data={stats.perTrail} keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <View style={[s.trail, { borderLeftColor: item.color_theme }]}>
            <Text style={s.trailTitle}>{item.title}</Text>
            <View style={s.statRow}>
              <Text style={s.statText}>✅ {item.seen}/{item.total}</Text>
              <Text style={s.statText}>🔒 Restam: {item.remaining}</Text>
            </View>
            <View style={s.progressTrack}>
              <View style={[s.progressBar, { width: `${item.total > 0 ? (item.seen / item.total) * 100 : 0}%` }]} />
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={s.btn} onPress={() => navigation.navigate('Home')}>
        <Text style={s.btnTxt}>Voltar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ─── NAVIGATION 
const Stack = createNativeStackNavigator();
export default function App() {
  const [auth, setAuth] = useState(null);
  return (
    <ctx.Provider value={{ auth, setAuth }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {auth ? (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Trail" component={TrailScreen} />
              <Stack.Screen name="Stats" component={StatsScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ctx.Provider>
  );
}

// ─── STYLES 
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg, padding: 20 },
  logo: { fontSize: 28, fontWeight: 'bold', color: C.primary, textAlign: 'center', marginVertical: 30 },
  input: { backgroundColor: C.card, borderRadius: 12, padding: 16, color: C.text, fontSize: 16, marginBottom: 12 },
  btn: { backgroundColor: C.primary, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  btnSmall: { backgroundColor: C.card, borderRadius: 8, padding: 8, paddingHorizontal: 14 },
  btnTxt: { color: C.text, fontWeight: 'bold' },
  link: { color: C.primary, textAlign: 'center', marginTop: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  greeting: { color: C.text, fontSize: 20, fontWeight: 'bold' },
  xp: { color: C.primary, fontSize: 13, fontWeight: 'bold', marginTop: 2 },
  catScroll: { maxHeight: 44, marginBottom: 12 },
  catPill: { backgroundColor: C.card, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8 },
  catActive: { backgroundColor: C.primary },
  catText: { color: C.sub, fontSize: 13 },
  catTextActive: { color: C.text, fontWeight: 'bold' },
  trail: { backgroundColor: C.card, borderRadius: 12, padding: 16, marginBottom: 12, borderLeftWidth: 5 },
  trailTitle: { color: C.text, fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  trailDesc: { color: C.sub, fontSize: 14, marginBottom: 8 },
  tagRow: { flexDirection: 'row', gap: 8 },
  tag: { color: C.sub, fontSize: 12 },
  trailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { color: C.text, fontSize: 18, fontWeight: 'bold' },
  counter: { color: C.sub, fontSize: 14 },
  progressTrack: { height: 4, backgroundColor: '#2A2A3E', borderRadius: 2, marginBottom: 12 },
  progressBar: { height: 4, backgroundColor: C.primary, borderRadius: 2 },
  countRow: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginBottom: 12 },
  countKnown: { color: C.green, fontSize: 14, fontWeight: 'bold' },
  countReview: { color: C.accent, fontSize: 14, fontWeight: 'bold' },
  countRemain: { color: C.sub, fontSize: 14, fontWeight: 'bold' },
  resultBox: { backgroundColor: C.card, borderRadius: 12, padding: 20, marginVertical: 20 },
  resultLine: { color: C.text, fontSize: 16, marginBottom: 8 },
  subtitle: { color: C.sub, textAlign: 'center', fontSize: 14, marginBottom: 16 },
  sectionTitle: { color: C.text, fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  statText: { color: C.sub, fontSize: 13 },
  cardArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { width: width - 60, height: 380, borderRadius: 20, backgroundColor: C.card },
  cardInner: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  cardLabel: { color: C.primary, fontSize: 12, fontWeight: 'bold', marginBottom: 12 },
  cardText: { color: C.text, fontSize: 20, textAlign: 'center', fontWeight: '600' },
  hint: { color: C.sub, fontSize: 12, marginTop: 20 },
  swipeRow: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 20 },
  swipeBtn: { padding: 16, borderRadius: 12, flex: 0.48, alignItems: 'center' }
});
