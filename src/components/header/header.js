import {Col, Container,Image, Row} from "react-bootstrap";
import styles from './header.module.scss';

export default function Header() {
    return(
        <header className={styles.header}>
            <Container>
                <Row>
                    <Col xs={4} lg={3}>
                        <Image src={'/images/logo@lg.png'} height={'30px'}/>
                    </Col>
                </Row>
            </Container>
        </header>
    );
}

