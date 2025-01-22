import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { resetFields } from '../../redux/works/works.action';

const RouteWatcher = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (!url.includes('/works')) {
        console.log('change')
        dispatch(resetFields());
      }
    };
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router, dispatch]);

  return null;
};

export default RouteWatcher;
