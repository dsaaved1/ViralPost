import axios from 'axios';

const API_ENDPOINTS = {
  hashtags: {
    US: 'https://api.apify.com/v2/actor-tasks/diego.saavedra~daily-tiktok-hashtags-trends-us/runs/last/dataset/items?token=apify_api_8zOwJVitoZkpWAgPVREiY4hz8P1kFr3SEIr1',
    MX: 'https://api.apify.com/v2/actor-tasks/diego.saavedra~daily-tiktok-hashtags-trends-mx/runs/last/dataset/items?token=apify_api_8zOwJVitoZkpWAgPVREiY4hz8P1kFr3SEIr1',
    ID: 'https://api.apify.com/v2/actor-tasks/diego.saavedra~daily-tiktok-hashtags-trends-indonesia/runs/last/dataset/items?token=apify_api_8zOwJVitoZkpWAgPVREiY4hz8P1kFr3SEIr1'
  },
  songs: {
    US: 'https://api.apify.com/v2/actor-tasks/diego.saavedra~daily-tiktok-songs-trends-us/runs/last/dataset/items?token=apify_api_8zOwJVitoZkpWAgPVREiY4hz8P1kFr3SEIr1',
    BR: 'https://api.apify.com/v2/actor-tasks/diego.saavedra~daily-tiktok-song-trends-brazil/runs/last/dataset/items?token=apify_api_8zOwJVitoZkpWAgPVREiY4hz8P1kFr3SEIr1'
  },
  videos: {
    US: 'https://api.apify.com/v2/actor-tasks/diego.saavedra~daily-tiktok-videos-trends-hot-us/runs/last/dataset/items?token=apify_api_8zOwJVitoZkpWAgPVREiY4hz8P1kFr3SEIr1',
    BR: 'https://api.apify.com/v2/actor-tasks/diego.saavedra~daily-tiktok-videos-trends-brazil/runs/last/dataset/items?token=apify_api_8zOwJVitoZkpWAgPVREiY4hz8P1kFr3SEIr1'
  }
};

const INDUSTRY_ENDPOINT = 'https://gist.githubusercontent.com/diegoas2/e7e1c3cc75018c30e2276dffc7213462/raw/bbedf8051e17648ba6f901585430363843a04a06/entertainment-hashtags.json';

export const api = {
  async getTopHashtags(country = 'US', isIndustryMode = false) {
    try {
      if (isIndustryMode) {
        const response = await axios.get(INDUSTRY_ENDPOINT);
        
        if (!Array.isArray(response.data)) {
          return [];
        }

        return response.data.map(item => ({
          id: item.hashtag_id,
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

  async getTopVideos(country = 'US') {
    try {
      const endpoint = API_ENDPOINTS.videos[country] || API_ENDPOINTS.videos.US;
      const response = await axios.get(endpoint);
      
      if (!Array.isArray(response.data) || response.data.length === 0) {
        return [];
      }

      return response.data.map(item => ({
        id: item.id,
        cover: item.cover,
        duration: item.duration,
        url: item.item_url,
        title: item.title
      }));
    } catch (error) {
      console.error('Error fetching videos:', error);
      return [];
    }
  }
}; 