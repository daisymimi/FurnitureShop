const getNodeUrl = () => {
  return process.env.NEXT_PUBLIC_RPC || "http://localhost:8545";
};

export default getNodeUrl;
