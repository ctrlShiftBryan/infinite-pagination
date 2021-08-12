import { useQuery } from "@apollo/client";
import { GET_STREETNAMES } from "./queries";
import { Button, Container, Icon, Menu } from "semantic-ui-react";
import styles from "./app.module.scss";
import { useEffect, useRef, useState } from "react";
import Counter from "./Counter";

const first = 10;
const delay = true;

export default function App() {
  const { error, data, fetchMore, networkStatus } = useQuery(GET_STREETNAMES, {
    variables: { first, delay },
    notifyOnNetworkStatusChange: true,
  });

  const observerRef = useRef(null);
  const [buttonRef, setButtonRef] = useState(null);

  useEffect(() => {
    const options = {
      root: document.querySelector("#list"),
      threshold: 0.1,
    };
    observerRef.current = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        entry.target.click();
      }
    }, options);
  }, []);

  useEffect(() => {
    if (buttonRef) {
      observerRef.current.observe(document.querySelector("#buttonLoadMore"));
    }
  }, [buttonRef]);

  if (error) {
    console.log(error);
    return <div>Error</div>;
  }

  if (networkStatus === 1) {
    return <div>Loading...</div>;
  }

  const hasNextPage = data.streetNames.pageInfo.hasNextPage;
  const isRefetching = networkStatus === 3;

  return (
    <>
      <Menu inverted color="blue" fixed="top" className={styles.menu}>
        <Menu.Item header>
          <Icon name="list" />
          <Icon name="redo alternate" />
          Infinite scroll
        </Menu.Item>
      </Menu>
      <Container className={styles.container}>
        <div id="list" className={styles.list}>
          {data.streetNames.edges.map((edge) => {
            return (
              <div key={edge.node.hash} className={styles.row}>
                {edge.node.streetName}
                <span className={styles.index}>{edge.node.index}</span>
              </div>
            );
          })}
          {hasNextPage && (
            <div className={styles.row}>
              <Button
                className={styles.btn}
                size="mini"
                ref={setButtonRef}
                id="buttonLoadMore"
                disabled={isRefetching}
                loading={isRefetching}
                onClick={() =>
                  fetchMore({
                    variables: {
                      first,
                      after: data.streetNames.pageInfo.endCursor,
                      delay,
                    },
                  })
                }
              >
                load more
              </Button>
            </div>
          )}
        </div>
        <Counter amountLoaded={data.streetNames.edges.length} />
      </Container>
    </>
  );
}
