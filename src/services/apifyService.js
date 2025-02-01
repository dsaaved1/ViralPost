import axios from 'axios';

// Add imports for default images
const DEFAULT_VIDEO_COVER = require('../assets/images/cover-video.png');
const DEFAULT_SONG_COVER = require('../assets/images/cover-song.jpeg');

const API_ENDPOINTS = {
  hashtags: {
    AU: 'https://api.apify.com/v2/actor-tasks/diegoas2~au-hashtags/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    BR: 'https://api.apify.com/v2/actor-tasks/diegoas2~br-hashtags/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    CA: 'https://api.apify.com/v2/actor-tasks/diegoas2~ca-hashtags/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    DE: 'https://api.apify.com/v2/actor-tasks/diegoas2~de-hashtags/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    ES: 'https://api.apify.com/v2/actor-tasks/diegoas2~es-hashtags/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    FR: 'https://api.apify.com/v2/actor-tasks/diegoas2~fr-hashtags/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    GB: 'https://api.apify.com/v2/actor-tasks/diegoas2~gb-hashtags/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    ID: 'https://api.apify.com/v2/actor-tasks/diegoas2~id-hashtags/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    JP: 'https://api.apify.com/v2/actor-tasks/diegoas2~jp-hashtags/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    MX: 'https://api.apify.com/v2/actor-tasks/diegoas2~mx-hashtags/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    MY: 'https://api.apify.com/v2/actor-tasks/diegoas2~my-hashtags/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    PH: 'https://api.apify.com/v2/actor-tasks/diegoas2~ph-hashtags/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    US: 'https://api.apify.com/v2/actor-tasks/diegoas2~us-hashtags/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ'
  },
  songs: {
    AU: 'https://api.apify.com/v2/actor-tasks/diegoas2~au-songs/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    BR: 'https://api.apify.com/v2/actor-tasks/diegoas2~br-songs/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    CA: 'https://api.apify.com/v2/actor-tasks/diegoas2~ca-songs/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    DE: 'https://api.apify.com/v2/actor-tasks/diegoas2~de-songs/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    ES: 'https://api.apify.com/v2/actor-tasks/diegoas2~es-songs/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    FR: 'https://api.apify.com/v2/actor-tasks/diegoas2~fr-songs/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    GB: 'https://api.apify.com/v2/actor-tasks/diegoas2~gb-songs/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    ID: 'https://api.apify.com/v2/actor-tasks/diegoas2~id-songs/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    JP: 'https://api.apify.com/v2/actor-tasks/diegoas2~jp-songs/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    MX: 'https://api.apify.com/v2/actor-tasks/diegoas2~mx-songs/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    MY: 'https://api.apify.com/v2/actor-tasks/diegoas2~my-songs/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    PH: 'https://api.apify.com/v2/actor-tasks/diegoas2~ph-songs/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    US: 'https://api.apify.com/v2/actor-tasks/diegoas2~us-songs/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ'
  },
  videos: {
    AU: 'https://api.apify.com/v2/actor-tasks/diegoas2~australia-videos-hot/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    BR: 'https://api.apify.com/v2/actor-tasks/diegoas2~brazil-videos-hot/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    CA: 'https://api.apify.com/v2/actor-tasks/diegoas2~canada-videos-hot/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    DE: 'https://api.apify.com/v2/actor-tasks/diegoas2~germany-videos-hot/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    ES: 'https://api.apify.com/v2/actor-tasks/diegoas2~spain-videos-hot/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    FR: 'https://api.apify.com/v2/actor-tasks/diegoas2~france-videos-hot/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    GB: 'https://api.apify.com/v2/actor-tasks/diegoas2~uk-videos-hot/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    ID: 'https://api.apify.com/v2/actor-tasks/diegoas2~indonesia-videos-hot/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    JP: 'https://api.apify.com/v2/actor-tasks/diegoas2~japan-videos-hot/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    MY: 'https://api.apify.com/v2/actor-tasks/diegoas2~malaysia-videos-hot/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    PH: 'https://api.apify.com/v2/actor-tasks/diegoas2~philippines-videos-hot/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
    US: 'https://api.apify.com/v2/actor-tasks/diegoas2~us-videos-hot/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ'
  },
  videoSorts: {
    US: {
      hot: 'https://api.apify.com/v2/actor-tasks/diegoas2~us-videos-hot/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
      likes: 'https://api.apify.com/v2/actor-tasks/diegoas2~us-videos-likes/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
      comments: 'https://api.apify.com/v2/actor-tasks/diegoas2~us-videos-comments/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
      shares: 'https://api.apify.com/v2/actor-tasks/diegoas2~us-videos-shares/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ'
    },
  }
};

const INDUSTRY_ENDPOINTS = {
  allCategories: 'https://raw.githubusercontent.com/dsaaved1/tiktok-trends-data/refs/heads/main/all-categories',
  apparel: 'https://raw.githubusercontent.com/dsaaved1/tiktok-trends-data/refs/heads/main/apparel.json',
  beauty :'https://raw.githubusercontent.com/dsaaved1/tiktok-trends-data/refs/heads/main/beauty.json',
  education: 'https://raw.githubusercontent.com/dsaaved1/tiktok-trends-data/refs/heads/main/education.json',
  entertainment: 'https://raw.githubusercontent.com/dsaaved1/tiktok-trends-data/refs/heads/main/entertainment',
  financial: 'https://raw.githubusercontent.com/dsaaved1/tiktok-trends-data/refs/heads/main/financial.json',
  food: 'https://raw.githubusercontent.com/dsaaved1/tiktok-trends-data/refs/heads/main/food.json',
  games: 'https://raw.githubusercontent.com/dsaaved1/tiktok-trends-data/refs/heads/main/games.json',
  sports: 'https://raw.githubusercontent.com/dsaaved1/tiktok-trends-data/refs/heads/main/sports.json',
  tech: 'https://raw.githubusercontent.com/dsaaved1/tiktok-trends-data/refs/heads/main/tech.json',
  travel: 'https://raw.githubusercontent.com/dsaaved1/tiktok-trends-data/refs/heads/main/travel.json',
  vehicle: 'https://raw.githubusercontent.com/dsaaved1/tiktok-trends-data/refs/heads/main/vehicle.json'
};

const mapVideoData = (item) => ({
  id: item.video_id,
  cover: item.thumbnail || DEFAULT_VIDEO_COVER,
  duration: item.duration_in_sec,
  title: item.title,
  url: item.url,
  region: item.region,
  countryCode: item.country_code,
  author: item.author,
  stats: item.stats
});

export const api = {
  async getTopHashtags(country = 'US', isIndustryMode = false, industry = 'entertainment') {
    try {
      if (isIndustryMode) {
        const endpoint = INDUSTRY_ENDPOINTS[industry] || INDUSTRY_ENDPOINTS.entertainment;
        const response = await axios.get(endpoint);
        
        if (!Array.isArray(response.data)) {
          return [];
        }

        return response.data
          .filter(item => item.hashtag_name !== '1') // Filter out invalid entries
          .map(item => ({
            id: item.hashtag_id || String(Math.random()),
            name: item.hashtag_name,
            posts: item.publish_cnt,
            rank: item.rank,
            rankDiff: item.rank_diff || 0,
            rankDiffType: item.rank_diff_type
          }));
      }

      const endpoint = API_ENDPOINTS.hashtags[country] || API_ENDPOINTS.hashtags.US;
      const response = await axios.get(endpoint);
      
      if (!Array.isArray(response.data) || response.data.length === 0) {
        return [];
      }

      return response.data.map(item => ({
        id: item.hashtag_id,
        name: item.hashtag_name,
        posts: item.publish_cnt,
        views: item.video_views,
        rank: item.rank,
        rankDiff: item.rank_diff || 0,
        rankDiffType: item.rank_diff_type
      }));
    } catch (error) {
      console.error('Error fetching hashtags:', error);
      return [];
    }
  },

  async getTopSongs(country = 'US') {
    try {
      const endpoint = API_ENDPOINTS.songs[country] || API_ENDPOINTS.songs.US;
      const response = await axios.get(endpoint);
      
      if (!Array.isArray(response.data) || response.data.length === 0) {
        console.log('Empty or invalid response:', response.data);
        return [];
      }

      return response.data.map(item => {
        // Calculate rankDiffType based on rank_progress
        let rankDiff = 0;
        let rankDiffType = 4; // Default to "New"

        if (item.rank_progress > 0) {
          rankDiff = item.rank_progress;
          rankDiffType = 1; // Up
        } else if (item.rank_progress < 0) {
          rankDiff = Math.abs(item.rank_progress);
          rankDiffType = 3; // Down
        } else if (item.rank_progress === 0) {
          rankDiffType = 4; // New
        }

        return {
          id: item.song_id || item.clip_id || String(Math.random()),
          title: item.title || '',
          author: item.author || '',
          cover: item.cover_url || DEFAULT_SONG_COVER,
          rank: item.rank || 0,
          link: item.link || '',
          duration: item.duration || '',
          rankDiff,
          rankDiffType,
          trends: item.trends || [],
          relatedItems: item.related_items || []
        };
      });
    } catch (error) {
      console.error('Error fetching songs:', error);
      return [];
    }
  },

  async getTopVideos(country, sort = 'hot') {
    try {
      const url = sort === 'hot' ? 
        API_ENDPOINTS.videos[country] : 
        API_ENDPOINTS.videoSorts[country]?.[sort];

      if (!url) {
        throw new Error('Invalid country or sort option');
      }

      const response = await axios.get(url);
      const data = await response.data;
      
      return data.map(mapVideoData);
    } catch (error) {
      console.error('Error fetching videos:', error);
      return [];
    }
  }
}; 