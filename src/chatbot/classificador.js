
import { dadosTreinamento } from "./dadosTreinamento";

const palavrasIgnoradas = new Set([
  "a",
  "as",
  "o",
  "os",
  "um",
  "uma",
  "uns",
  "umas",
  "de",
  "da",
  "das",
  "do",
  "dos",
  "em",
  "na",
  "nas",
  "no",
  "nos",
  "por",
  "para",
  "com",
  "sem",
  "que",
  "qual",
  "quais",
  "como",
  "onde",
  "quando",
  "quanto",
  "quantos",
  "quantas",
  "quem",
  "eu",
  "me",
  "meu",
  "minha",
  "meus",
  "minhas",
  "voce",
  "voces",
  "ele",
  "ela",
  "eles",
  "elas",
  "isso",
  "isto",
  "esse",
  "essa",
  "este",
  "esta",
  "ser",
  "estar",
  "ter",
  "tem",
  "tenho",
  "foi",
  "sao",
  "e",
  "ou",
  "se",
  "ja",
  "ainda",
  "mais",
  "muito",
  "muita",
  "muitos",
  "muitas",
  "algum",
  "alguma",
  "alguns",
  "algumas",
  "ao",
  "aos",
  "pela",
  "pelo",
  "pelas",
  "pelos",
  "ate",
  "tambem",
  "so",
  "sim",
  "nao",
]);

function normalizar(texto) {
  return String(texto)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenizar(texto) {
  return normalizar(texto)
    .split(" ")
    .filter(
      (palavra) =>
        palavra.length > 1 &&
        !palavrasIgnoradas.has(palavra)
    );
}

function treinarModelo(dados) {
  const modelo = {
    classes: {},
    vocabulario: new Set(),
    presencaPorClasse: {},
    totalExemplos: 0,
  };

  for (const grupo of dados) {
    const classe = {
      frequencias: {},
      totalPalavras: 0,
      totalExemplos: grupo.exemplos.length,
    };

    const palavrasDaClasse = new Set();

    for (const exemplo of grupo.exemplos) {
      const palavras = tokenizar(exemplo);

      for (const palavra of palavras) {
        modelo.vocabulario.add(palavra);
        palavrasDaClasse.add(palavra);

        classe.frequencias[palavra] =
          (classe.frequencias[palavra] || 0) + 1;

        classe.totalPalavras++;
      }
    }

    for (const palavra of palavrasDaClasse) {
      modelo.presencaPorClasse[palavra] =
        (modelo.presencaPorClasse[palavra] || 0) + 1;
    }

    modelo.classes[grupo.intencao] = classe;
    modelo.totalExemplos += grupo.exemplos.length;
  }

  return modelo;
}

const modelo = treinarModelo(dadosTreinamento);

export function classificarMensagem(texto) {
  const palavras = tokenizar(texto);

  if (palavras.length === 0) {
    return {
      intencao: null,
      confianca: 0,
    };
  }

  const palavrasConhecidas = palavras.filter((palavra) =>
    modelo.vocabulario.has(palavra)
  );

  const palavrasEspecificas = palavrasConhecidas.filter(
    (palavra) =>
      modelo.presencaPorClasse[palavra] <= 2
  );

  if (palavrasEspecificas.length === 0) {
    return {
      intencao: null,
      confianca: 0,
    };
  }

  const cobertura =
    palavrasConhecidas.length / palavras.length;

  if (cobertura < 0.2) {
    return {
      intencao: null,
      confianca: 0,
    };
  }

  const resultados = [];
  const tamanhoVocabulario = modelo.vocabulario.size;

  for (const [intencao, classe] of Object.entries(
    modelo.classes
  )) {
    let pontuacao = Math.log(
      classe.totalExemplos / modelo.totalExemplos
    );

    for (const palavra of palavrasConhecidas) {
      const frequencia =
        classe.frequencias[palavra] || 0;

      const probabilidade =
        (frequencia + 1) /
        (classe.totalPalavras + tamanhoVocabulario);

      pontuacao += Math.log(probabilidade);
    }

    resultados.push({
      intencao,
      pontuacao,
    });
  }

  resultados.sort(
    (a, b) => b.pontuacao - a.pontuacao
  );

  const maiorPontuacao = resultados[0].pontuacao;

  const probabilidades = resultados.map((resultado) =>
    Math.exp(resultado.pontuacao - maiorPontuacao)
  );

  const somaProbabilidades = probabilidades.reduce(
    (total, valor) => total + valor,
    0
  );

  const confianca =
    probabilidades[0] / somaProbabilidades;

  if (confianca < 0.55) {
    return {
      intencao: null,
      confianca,
    };
  }

  return {
    intencao: resultados[0].intencao,
    confianca,
  };
}
