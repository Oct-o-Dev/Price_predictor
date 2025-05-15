import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

const API_URL = 'https://movie-recommender-api-ramo.onrender.com';

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [topN, setTopN] = useState('10'); // <-- new input for number of recommendations

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const delayDebounceFn = setTimeout(() => {
        searchMovies();
      }, 400);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const searchMovies = async () => {
    try {
      const res = await axios.get(`${API_URL}/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchResults(res.data.results);
    } catch (err) {
      console.error('Search Error:', err.message);
    }
  };

  const getRecommendations = async (movieTitle) => {
    const top_n = parseInt(topN) || 10;

    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/recommend?movie=${encodeURIComponent(movieTitle)}&top_n=${top_n}`);
      setRecommendations(res.data.results);
      setSearchQuery('');
      setSearchResults([]);
    } catch (err) {
      console.error('Recommendation Error:', err.message);
    }
    setLoading(false);
  };

  const renderMovieItem = ({ item }) => (
    <TouchableOpacity style={styles.movieItem} onPress={() => getRecommendations(item)}>
      <Text style={styles.movieTitle}>{item}</Text>
    </TouchableOpacity>
  );

  const renderRecommendationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.recommendationItem}
      onPress={() => navigation.navigate('MovieDetails', { movie: item })}
    >
      <Text style={styles.recommendationTitle}>{item.title}</Text>
      <Text style={styles.recommendationGenres}>{item.genres}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by full title like 'Toy Story (1995)'"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <TextInput
        style={styles.topNInput}
        placeholder="Number of recommendations (e.g. 10)"
        value={topN}
        onChangeText={setTopN}
        keyboardType="numeric"
      />

      {searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item}
          style={styles.searchResults}
        />
      ) : (
        searchQuery.length > 0 && (
          <Text style={{ textAlign: 'center', color: 'gray' }}>No movies found</Text>
        )
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <FlatList
          data={recommendations}
          renderItem={renderRecommendationItem}
          keyExtractor={(item) => item.title}
          style={styles.recommendations}
          ListHeaderComponent={
            recommendations.length > 0 && (
              <Text style={styles.recommendationsTitle}>Recommended Movies</Text>
            )
          }
          ListEmptyComponent={
            !loading && (
              <Text style={{ textAlign: 'center', color: 'gray' }}>No recommendations yet</Text>
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  topNInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchResults: {
    maxHeight: 200,
    marginBottom: 16,
  },
  movieItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  movieTitle: {
    fontSize: 16,
  },
  recommendations: {
    flex: 1,
  },
  recommendationsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  recommendationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recommendationGenres: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
