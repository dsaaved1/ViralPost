import axios from 'axios';

const API_ENDPOINTS = {
  hashtags: {
    AU: 'https://api.apify.com/v2/datasets/8IDS8oBiZHXN0yAe7/items?token=apify_api_xs3j4k85bc6yWYDl6B418unoQcR6HI0erJsg',
    BR: 'https://api.apify.com/v2/datasets/qcHVPBhtQd9Qf4nY7/items?token=apify_api_xs3j4k85bc6yWYDl6B418unoQcR6HI0erJsg',
    CA: 'https://api.apify.com/v2/datasets/2QkDWW3XIv0c3pXoF/items?token=apify_api_xs3j4k85bc6yWYDl6B418unoQcR6HI0erJsg',
    DE: 'https://api.apify.com/v2/datasets/W82EiGKEQlNmfgGop/items?token=apify_api_xs3j4k85bc6yWYDl6B418unoQcR6HI0erJsg',
    ES: 'https://api.apify.com/v2/datasets/1kd9PNkafy7qbgTJe/items?token=apify_api_xs3j4k85bc6yWYDl6B418unoQcR6HI0erJsg',
    FR: 'https://api.apify.com/v2/datasets/QOKJGsA6HsvhS2cf5/items?token=apify_api_xs3j4k85bc6yWYDl6B418unoQcR6HI0erJsg',
    GB: 'https://api.apify.com/v2/datasets/fgnRUST8BJX1i9oxV/items?token=apify_api_xs3j4k85bc6yWYDl6B418unoQcR6HI0erJsg',
    ID: 'https://api.apify.com/v2/datasets/VCzrHsb5gVzeoSkYN/items?token=apify_api_xs3j4k85bc6yWYDl6B418unoQcR6HI0erJsg',
    JP: 'https://api.apify.com/v2/datasets/QFoGlMR3P19N2SP6F/items?token=apify_api_xs3j4k85bc6yWYDl6B418unoQcR6HI0erJsg',
    KR: 'https://api.apify.com/v2/datasets/seSPbaxvQTSuil6aV/items?token=apify_api_xs3j4k85bc6yWYDl6B418unoQcR6HI0erJsg',
    MX: 'https://api.apify.com/v2/actor-tasks/diego.saavedra~daily-tiktok-hashtags-trends-mx/runs/last/dataset/items?token=apify_api_8zOwJVitoZkpWAgPVREiY4hz8P1kFr3SEIr1',
    MY: '',
    PH: '',
    US: 'https://api.apify.com/v2/actor-tasks/diegoas2~us-hashtags/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ'
  },
  songs: {
    AU: '',
    BR: 'https://api.apify.com/v2/actor-tasks/diego.saavedra~daily-tiktok-song-trends-brazil/runs/last/dataset/items?token=apify_api_8zOwJVitoZkpWAgPVREiY4hz8P1kFr3SEIr1',
    CA: '',
    DE: '',
    ES: '',
    FR: '',
    GB: '',
    ID: '',
    JP: '',
    MX: '',
    MY: '',
    PH: '',
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
      // hot: 'https://api.apify.com/v2/actor-tasks/diegoas2~us-videos-hot/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
      likes: 'https://api.apify.com/v2/actor-tasks/diegoas2~us-videos-likes/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
      comments: 'https://api.apify.com/v2/actor-tasks/diegoas2~us-videos-comments/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ',
      shares: 'https://api.apify.com/v2/actor-tasks/diegoas2~us-videos-shares/runs/last/dataset/items?token=apify_api_EeGgw6QrQRof8NqwjpSJqJPZ4hDSl41P0axQ'
    },
  }
};

const INDUSTRY_ENDPOINTS = {
  apparel: 'https://raw.githubusercontent.com/diegoas2/tiktok-trends-data/refs/heads/main/apparel.json',
  beauty :'https://raw.githubusercontent.com/diegoas2/tiktok-trends-data/refs/heads/main/beauty.json',
  education: 'https://raw.githubusercontent.com/diegoas2/tiktok-trends-data/refs/heads/main/education.json',
  entertainment: 'https://raw.githubusercontent.com/diegoas2/tiktok-trends-data/refs/heads/main/entertainment.json',
  financial: 'https://raw.githubusercontent.com/diegoas2/tiktok-trends-data/refs/heads/main/financial.json',
  food: 'https://raw.githubusercontent.com/diegoas2/tiktok-trends-data/refs/heads/main/food.json',
  games: 'https://raw.githubusercontent.com/diegoas2/tiktok-trends-data/refs/heads/main/games.json',
  sports: 'https://raw.githubusercontent.com/diegoas2/tiktok-trends-data/refs/heads/main/sports.json',
  tech: 'https://raw.githubusercontent.com/diegoas2/tiktok-trends-data/refs/heads/main/tech.json',
  travel: 'https://raw.githubusercontent.com/diegoas2/tiktok-trends-data/refs/heads/main/travel.json',
  vehicle: 'https://raw.githubusercontent.com/diegoas2/tiktok-trends-data/refs/heads/main/vehicle.json'
};

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

      return response.data.map(item => ({
        id: item.song_id || item.id || String(Math.random()),
        title: item.title || '',
        author: item.author || '',
        cover: item.cover || '',
        rank: item.rank || 0,
        link: item.link || '',
        duration: item.duration || ''
      }));
    } catch (error) {
      console.error('Error fetching songs:', error);
      return [];
    }
  },

  async getTopVideos(country, sort = 'hot') {
    try {
      const endpoint = API_ENDPOINTS.videoSorts[country]?.[sort] || API_ENDPOINTS.videos[country];
      if (!endpoint) {
        return [];
      }
      const response = await axios.get(endpoint);
      
      if (!Array.isArray(response.data) || response.data.length === 0) {
        return [];
      }

      return response.data.map(item => ({
        id: item.id,
        cover: item.cover,
        duration: item.duration,
        url: item.item_url,
        title: item.title,
        country_code: item.country_code
      }));
    } catch (error) {
      console.error('Error fetching videos:', error);
      return [];
    }
  }
}; 