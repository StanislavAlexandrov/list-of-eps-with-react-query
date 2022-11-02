import React from 'react';
import { useEffect, useState, memo } from 'react';
import './style.css';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';

export default function App() {
  const queryClient = new QueryClient();
  const [list, setList] = useState();
  const [formReq, setFormReq] = useState('');

  const [reqLink, setReqLink] = useState(
    'https://api.tvmaze.com/singlesearch/shows?q=girls'
  );

  const [allEpsLink, setAllEpsLink] = useState(
    'https://api.tvmaze.com/shows/1/episodes'
  );

  const [allEps, setAllEps] = useState('');

  useEffect(() => {
    fetch(reqLink)
      .then((res) => res.json())
      .then((data) => setList(data));
  }, [reqLink]);

  useEffect(() => {
    fetch(allEpsLink)
      .then((res) => res.json())
      .then((data) => setAllEps(data));
  }, [allEpsLink]);

  const showId = list?.id;

  const handleChange = (e) => {
    setFormReq(e.target.value);
  };

  const handleClick = () => {
    // setReqLink('');
    setReqLink('https://api.tvmaze.com/singlesearch/shows?q=' + formReq);

    setAllEpsLink('https://api.tvmaze.com/shows/' + showId + '/episodes');
  };

  const handleKeypress = (e) => {
    if (e.charCode === 13) {
      handleClick();
    }
  };

  const QueryTest = () => {
    const { isLoading, error, data } = useQuery(['repoData'], () =>
      fetch(reqLink).then((res, req) => res.json())
    );
    if (isLoading) return 'Loading...';
    if (error) return 'An error has occurred: ' + error.message;
    else return <div>from react query: {data?.name}</div>;
  };

  const MemoizedQueryTest = memo(QueryTest);

  return (
    <>
      <input
        type="input"
        onChange={handleChange}
        onKeyPress={handleKeypress}
      ></input>
      <button type="button" onClick={handleClick}>
        click
      </button>
      <div>{list && list.name}</div>
      <QueryClientProvider client={queryClient}>
        <QueryTest />
      </QueryClientProvider>
      <div>
        {allEps &&
          allEps.map((ep) => (
            <li>
              s{ep.season < 10 ? '0' + ep.season : ep.season}e
              {ep.number < 10 ? '0' + ep.number : ep.number} - {ep.name}
            </li>
          ))}
      </div>
    </>
  );
}
