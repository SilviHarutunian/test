import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const Sidebar = styled.div`
  min-width: 80px;
  height: 100vh;
  display: inline-block;
  margin-right: 20px;
  background-color: #cce0ff;
`;

const Categories = styled.div`
  height: 50px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  justify-content: center;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #003380;
  padding: 5px 10px;

  &:hover {
    background-color: #80b3ff;
  }
`;

const DisplayImages = styled.div`
  display: inline-block;
  width: 90%;
`;

const MoreImagesButton = styled.button`
  width: 200px;
  height: 50px;
  border-radius: 8px;
  background-color: #cce0ff;
  cursor: pointer;
  margin-top: 20px;
  display: block;

  &:hover {
    background-color: #80b3ff;
  }
`;

const Img = styled.img`
  width: 150px;
  height: 120px;
  margin: 10px; 
`;

function CatsApp() {
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const getCategories = await fetch(
        "https://api.thecatapi.com/v1/categories",
        {
          method: "GET",
          mode: "cors",
          headers: {
            "X-API-KEY": "897c8d57-479d-4bb2-b855-85475b91a6c4",
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((response) => {
          setCategories(response);
        });
    };

    fetchData();
  }, []);

  const getImages = (categoryId, isNewCategory) => {
    let url = new URL(
      `https://api.thecatapi.com/v1/images/search?limit=10&page=1&category_ids=${categoryId}`
    );

    fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "X-API-KEY": "897c8d57-479d-4bb2-b855-85475b91a6c4",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setImages(isNewCategory ? response : [...images, ...response]);
        setSelectedCategory(categoryId);
      });
  };

  return (
      <Container>
        <GlobalStyle />
        <Sidebar>
          {categories.map((item) => {
            return (
              <Categories
                key={item.id}
                onClick={() => getImages(item.id, true)}
              >
                {item.name}
              </Categories>
            );
          })}
        </Sidebar>
        <DisplayImages>
          {images.map((item) => {
            return <Img src={item.url} key={item.id} />;
          })}
          {selectedCategory && (
            <MoreImagesButton
              onClick={() => getImages(selectedCategory, false)}
            >
              Add more images
            </MoreImagesButton>
          )}
        </DisplayImages>
      </Container>
  );
}

ReactDOM.render(<CatsApp />, document.getElementById("root"));
