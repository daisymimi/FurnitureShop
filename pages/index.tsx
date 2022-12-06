import Link from "next/link";
import ConnectWalletButton from "src/components/connectWalletButton";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <>
      <h1 className={styles.title}>Homepage</h1>
      <ConnectWalletButton />
      <br />
      <br />
      <Link href="/products">Products</Link>
      <br />
      <br />
      <Link href="/my">My Products</Link>
    </>
  );
}
