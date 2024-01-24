import React, { useState, useEffect } from 'react';
import { Breadcrumb, Layout, Menu, theme, Radio, Card, Descriptions } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const App = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [meal, setMeal] = useState([]);
    const onCuisineChange = (e) => {
        setSelect(e.target.value); 
        setIsCuisineSelected(true);
        setIsRegionSelected(false); 
    };
    const onRegionChange = (e) => {
        setRegion(e.target.value); 
        setIsRegionSelected(true);
        setIsCuisineSelected(false);
    };
    const resetCuisineSelection = () => {
        setSelect(null); 
        setIsCuisineSelected(false);
    };
    
    const resetRegionSelection = () => {
        setRegion(null);
        setIsRegionSelected(false);
    };
    const onImgClick = (e) => {
        if (imgData === e) {
            setShowDescriptions(false);
            setImgData(null);
        } else {
            setImgData(e);
            setShowDescriptions(true);
        }
    }
    const [select, setSelect] = useState([]);
    const [region, setRegion] = useState([]);
    const [img, setImg] = useState([]);
    const [area, setArea] = useState([]);
    const [isCuisineSelected, setIsCuisineSelected] = useState(false);
    const [isRegionSelected, setIsRegionSelected] = useState(false);
    const [imgData, setImgData] = useState([]);
    const [recipe, setRecipe] =useState([]);
    const [showDescriptions, setShowDescriptions] = useState(false);
    useEffect(() => {
    (async () => {
        try {
            const response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list");
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const mealOptions = data.meals.map(item => ({
                label: item.strCategory,
                value: item.strCategory
            }));
            setMeal(mealOptions)
        } catch (error) {
            console.error('Fetch error:', error);
        }
    })();
    }, []);
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${imgData}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const meal = data.meals[0];
                let recipeOptions = [];
                for(let i = 1; i <= 20; i++) {
                    const ingredient = meal[`strIngredient${i}`];
                    const measure = meal[`strMeasure${i}`];
                    if(ingredient && ingredient !== "" && measure) {
                        recipeOptions.push({
                            label: ingredient,
                            children: `${measure}`
                        });
                    }
                }
                setRecipe(recipeOptions)
            } catch (error) {
                console.error('Fetch error:', error);
            }
        })();
    }, [imgData]);
    console.log(recipe)
    useEffect(() => {
    (async () => {
        try {
            const response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const areaOptions = data.meals.map(item => ({
                label: item.strArea,
                value: item.strArea
            }));
            setArea(areaOptions)
        } catch (error) {
            console.error('Fetch error:', error);
        }
    })();
    }, []);
    useEffect(() => {
        (async () => {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${select}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setImg(data.meals);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    })();
    }, [select]);
    useEffect(() => {
        (async () => {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${region}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setImg(data.meals);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    })();
    }, [region]);
    const [message, setMessage] = useState("");
    useEffect(() => {
        (async () => {
            const response = await fetch("/.netlify/functions/copyright");
            const data = await response.json();
            setMessage(data);
        })();
    }, []);
    return (
        <Layout>
        <Header
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 100
            }}
        >
            <h1 style={{color:"white"}}>作りたい料理を選ぼう</h1>
        </Header>
        <Content
            style={{
            padding: '0 48px',
            }}
        >
            <Layout
            style={{
                padding: '24px 0',
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
            }}
            >
            <Sider
                style={{
                    background: colorBgContainer,
                }}
                width={250}
            >
                <div><h1>以下の二つを一つ選んで<br/>その中の選択肢を選択</h1></div>
                <div>料理の種類からを選ぶ</div>
                <Radio.Group options={meal} onChange={onCuisineChange} disabled={isRegionSelected} value={select}/>
                <a onClick={resetCuisineSelection} style={{ marginLeft: 8 }}>選択を解除</a>
                <br />
                <br />
                <div>地域からを選ぶ</div>
                <Radio.Group options={area} onChange={onRegionChange} disabled={isCuisineSelected} value={region}/>
                <a onClick={resetRegionSelection} style={{ marginLeft: 8 }}>選択を解除</a>
                <br />
                <br />
            </Sider>
            <Content
                style={{
                    padding: '0 24px',
                    minHeight: 280,
                    display: 'flex', 
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start',
                    gap: '10px',
                    backgroundColor: '#91d5ff',
                    borderRadius: 10
                }}
            >
                {img && img.map(item => (
                    <div key={item.idMeal} style={{ marginBottom: '20px' }}>
                    <Card
                        title={item.strMeal}
                        bordered={false}
                        style={{ width: 500, margin: '20px 0', backgroundColor: '#e6f7ff' }}
                    >
                        <a onClick={() => onImgClick(item.idMeal)}>
                            <img src={item.strMealThumb} alt={item.strMeal} style={{ width: 400 }}/>
                        </a>
                        {showDescriptions && imgData === item.idMeal && (
                            <Descriptions layout='vertical' size='small' title={recipe.strMeal} bordered items={recipe}/>
                        )}
                    </Card>
                </div>
                ))}
            </Content>
            </Layout>
        </Content>
        <Footer
            style={{
            textAlign: 'center',
            }}
        >
            {message.belong} ©{new Date().getFullYear()} Created by {message.number} {message.name}
        </Footer>
        </Layout>
    );
};
export default App;