"use client"

import ContributionTable from "./Components/ContributionGraph"
import styles from './page.module.css'


export default function Home() {
  return (
  <div className={styles.main}>
    <ContributionTable />
  </div>
  )
}
