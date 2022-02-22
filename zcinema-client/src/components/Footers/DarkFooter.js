/*eslint-disable*/
import React from 'react';

// reactstrap components
import { Container } from 'reactstrap';

function DarkFooter() {
  return (
    <footer className='footer' data-background-color='black'>
      <Container>
        <nav>
          <ul>
            <li>
              <a href='/'>ZCinema</a>
            </li>
            <li>
              <a href='/about'>
                About
              </a>
            </li>
          </ul>
        </nav>
      </Container>
    </footer>
  );
}

export default DarkFooter;
