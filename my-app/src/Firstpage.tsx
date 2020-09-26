import React, {createContext, useState} from 'react';

import {Layout, Menu, Checkbox, Form, Button} from 'antd';
import {UserOutlined, LaptopOutlined, NotificationOutlined} from '@ant-design/icons';
import {Input} from 'antd';
import 'antd/dist/antd.css';
import CubeExample from './example-cube/CubeExample';

const {SubMenu} = Menu;
const {Header, Content, Footer, Sider} = Layout;

export const CubeContext = createContext<number | any>(0);

function Firstpage() {
    type AwatarProps = {
        x: number,
        z: number,
        color: string,
        name: string,
        isYou: boolean
    }

    const [color, changeColor] = useState('00ff00');
    const [showGrid, toggleShowGrid] = useState(true);
    const [showCube, toggleShowCube] = useState(true);
    const [awatarList, setAwatarList] = useState <AwatarProps[]>([]);

   //  setAwatarList(awatarList.concat([{"x": 100, "z": 100, "color": "00ff00", "name": "Joel", "isYou": true},
     //    {"x": -100, "z": -100, "color": "129292", "name": "FredrikDa", "isYou": false},
       //  {"x": -150, "z": -150, "color": "ef0092", "name": "Henrik", "isYou": false}]));

    let contextParameters = {
        color, changeColor,
        showGrid, toggleShowGrid,
        showCube, toggleShowCube,
        awatarList
    }

    const onFinish = (values: AwatarProps) => {
        console.log('Success:', values);

       // awatarList.push({"name": values.name, "x": values.x, "z": values.z, "color": values.color, "isYou": false});
       setAwatarList(awatarList.concat({"name": values.name, "x": values.x, "z": values.z, "color": values.color, "isYou": values.isYou}));

    };

    const emptyByName = (values: AwatarProps) => {
        console.log('emptyByName:', values);

        let newAwatarList;

        newAwatarList = awatarList.filter(function(item) {
            return item.name !== values.name
        });

        setAwatarList( new Array());
        setAwatarList(newAwatarList);

    };


    const emptyList = () => {
        console.log('emptyList pressed ');

        // awatarList.push({"name": values.name, "x": values.x, "z": values.z, "color": values.color, "isYou": false});
        setAwatarList( new Array());

    };
    async function getConnectedDevices(type:string) {
        const d = await navigator.mediaDevices.getUserMedia({ audio: true});
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log("device", devices);
        return devices.filter(device => device.kind === type)
    }
    const videoCameras = getConnectedDevices('audioinput');
    console.log('audioinput ', videoCameras)

    const videoCameras2 = getConnectedDevices('audiooutput');
    console.log('audiooutput ', videoCameras2)


    return (
        <CubeContext.Provider value={contextParameters}>
            <Layout>
                <Header className="header" style={{backgroundColor: "gray"}}>
                    <h1>AW-Chatt</h1>
                </Header>
                <Content style={{padding: '0 12px'}}>
                    <Layout className="site-layout-background" style={{padding: '12px 0'}}>
                        <Sider style={{backgroundColor: "gray"}} width={200}>
                            <Input onChange={e => changeColor(e.target.value)} placeholder="Color Code"/>
                            <Checkbox onChange={() => toggleShowGrid(!showGrid)}>Show Grid</Checkbox>
                            <Checkbox onChange={() => toggleShowCube(!showCube)}>Show Cube</Checkbox>
                            <Form
                                name="basic"
                                initialValues={{ isYou: false }}
                                onFinish={onFinish}
                            >
                                <Form.Item
                                    label={"Name"}
                                    name="name"
                                    rules={[{required: true, message: 'Please input your name!'}]}
                                >
                                    <Input/>
                                </Form.Item>
                                <Form.Item
                                    label={"Color"}
                                    name="color"
                                    rules={[{required: true, message: 'Please input your color!'}]}
                                >
                                    <Input/>
                                </Form.Item>
                                <Form.Item
                                    label={"X-pos"}
                                    name="x"
                                    rules={[{required: true, message: 'Please input your x!'}]}
                                >
                                    <Input/>
                                </Form.Item>
                                <Form.Item
                                    label={"Z-pos"}
                                    name="z"
                                    rules={[{required: true, message: 'Please input your z!'}]}
                                >
                                    <Input/>
                                </Form.Item>
                                <Form.Item name="isYou" valuePropName="checked">
                                    <Checkbox>Is myself?</Checkbox>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Form>
                            <hr />
                            <p />
                            <Form
                                name="basic"
                                initialValues={{ isYou: false }}
                                onFinish={emptyByName}
                            >
                                <Form.Item
                                    label={"Name"}
                                    name="name"
                                    rules={[{required: true, message: 'Please input your name!'}]}
                                >
                                    <Input/>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Delete
                                    </Button>
                                </Form.Item>
                            </Form>
                            <hr />
                            <p />
                            <Button onClick={emptyList}>
                                Delete All
                            </Button>
                        </Sider>
                        <Content style={{padding: '0 24px', minHeight: 280}}>
                            <CubeExample/>
                        </Content>
                    </Layout>
                </Content>
                <Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout>
        </CubeContext.Provider>
    )
}

export default Firstpage;