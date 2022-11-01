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
  const [link, setLink] = useState('');

  const [reqLink, setReqLink] = useState(
    'https://api.tvmaze.com/singlesearch/shows?q=girls'
  );
  useEffect(() => {
    fetch(reqLink)
      .then((res) => res.json())
      .then((data) => setList(data));
  }, [reqLink]);

  const handleChange = (e) => {
    setFormReq(e.target.value);
  };

  const handleClick = () => {
    setReqLink('');
    setReqLink('https://api.tvmaze.com/singlesearch/shows?q=' + formReq);
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
    else return <div>{data?.name}</div>;
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
        <MemoizedQueryTest />
      </QueryClientProvider>
    </>
  );
}
