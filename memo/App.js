import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';

const App = () => {
  const [cartas, setCartas] = useState(generarCartas()); // Genera las cartas
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [coincidentes, setCoincidentes] = useState([]);
  const [movimientos, setMovimientos] = useState(0);

  useEffect(() => {
    if (seleccionadas.length === 2) {
      verificarCoincidencias();
    }
  }, [seleccionadas]);

  function generarCartas() {
    const imagenes = [
      require('./assets/jake.png'),
      require('./assets/hela.png'),
      require('./assets/brum.png'),
      require('./assets/finn.png'),
      require('./assets/bubble.png'),
      require('./assets/mentita.png'),
      require('./assets/bmo.png'),
      require('./assets/gunter.png'),
    ];

    const pares = imagenes.concat(imagenes);
    const paresMezclados = pares.sort(() => Math.random() - 0.5);
    return paresMezclados.map((imagen, index) => ({
      id: index,
      imagen,
      volteada: false,
      emparejada: false,
    }));
  }

  const manejarPresionCarta = (id) => {
    if (seleccionadas.length === 2 || cartas[id].emparejada) return;

    setSeleccionadas([...seleccionadas, id]);
    setCartas(prevCartas =>
      prevCartas.map(carta =>
        carta.id === id ? { ...carta, volteada: true } : carta
      )
    );
  };

  const verificarCoincidencias = () => {
    const [primerId, segundoId] = seleccionadas;
    const nuevasCartas = [...cartas];
    if (cartas[primerId].imagen === cartas[segundoId].imagen) {
      nuevasCartas[primerId].emparejada = true;
      nuevasCartas[segundoId].emparejada = true;
      setCoincidentes([...coincidentes, primerId, segundoId]);
    } else {
      setTimeout(() => {
        nuevasCartas[primerId].volteada = false;
        nuevasCartas[segundoId].volteada = false;
        setCartas(nuevasCartas);
      }, 1000);
    }
    setSeleccionadas([]);
    setMovimientos(movimientos + 1);
  
    // Verificar si todas las cartas están emparejadas
    const todasEmparejadas = nuevasCartas.every(carta => carta.emparejada);
    if (todasEmparejadas) {
      // Mostrar la alerta de juego ganado
      Alert.alert(
        "¡Felicidades!",
        "Has ganado el juego",
        [
          {
            text: "OK",
            onPress: () => reiniciarJuego()
          }
        ]
      );
    }
  };

  const reiniciarJuego = () => {
    setCartas(generarCartas());
    setSeleccionadas([]);
    setCoincidentes([]);
    setMovimientos(0);
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.movimientos}>Movimientos: {movimientos}</Text>
      <View style={styles.contenedorCartas}>
        {cartas.map(carta => (
          <TouchableOpacity
            key={carta.id}
            style={[
              styles.carta,
              carta.volteada || carta.emparejada ? styles.cartaVisible : null,
            ]}
            onPress={() => manejarPresionCarta(carta.id)}
            disabled={carta.volteada || carta.emparejada}
          >
            <Image
              style={styles.imagenCarta}
              source={carta.volteada || carta.emparejada ? carta.imagen : require('./assets/atras.jpeg')}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  movimientos: {
    marginBottom: 20,
    fontSize: 20,
  },
  contenedorCartas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carta: {
    width: 60,
    height: 80,
    margin: 17,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cartaVisible: {
    backgroundColor: 'transparent',
  },
  imagenCarta: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default App;
