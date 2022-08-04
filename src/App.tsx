import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './App.css';
import Modal from './components/modal';
import Users from './components/users';
import { IUsers } from './types/types';
import InputMask from "react-input-mask";

const App = () => {
	const urlServer = "https://enigmatic-fjord-56411.herokuapp.com/api/";
	const [users,setUsers]=useState<IUsers[]>([]);
	const [loader,setLoader]=useState<boolean>(true);

	useEffect(()=>{
		getUsers();
	},[]);
	async function getUsers() {
		try{
			const response = await axios.get<IUsers[]>(urlServer+'contacts');
			setUsers(response.data);
			setLoader(false);
		}
		catch(e){console.log(e)}
	}

	//---------- add
	const [activity,setActivity]=useState<boolean>(false);
	const [valueName,setValueName]=useState<string>('');
	const [valueNumber,setValueNumber]=useState<string>('');

	const changeValueName=(e:React.ChangeEvent<HTMLInputElement>)=>{
		setValueName(e.target.value);
	}
	const changeValueNumber=(e:React.ChangeEvent<HTMLInputElement>)=>{
		setValueNumber(e.target.value);
	}
	const clearForm=()=>{
		setActivity(false);
		setValueName('');
		setValueNumber('');
	}
	const addContact=()=>{
		if(valueName!==''&&valueNumber!==''&&valueNumber[valueNumber.length-1]!=='_'){
			axios.post(urlServer+`contact/${valueName}/${valueNumber}`);
			getUsers();
			clearForm();
		}
	}
	//------ delete
	const [idRecord,setIdRecord]=useState<number>(0);
	const [indexRecord,setIndexRecord]=useState<number>(-1);
	const setIdAndIndex=(id:number)=>{
		setIdRecord(id);
		users.map(i=>{if(i.id===id) setIndexRecord(users.indexOf(i)) });
	}

	const [activity1,setActivity1]=useState<boolean>(false);

	
	const deleteContact=async()=>{
		if(idRecord!==0){
			await axios.delete(urlServer+`contact/${idRecord}`)
			getUsers();
			setIdRecord(0);
			setIndexRecord(-1);
			setActivity1(false);
		}
	}
	//------ change
	const [activity2,setActivity2]=useState<boolean>(false);
	const [valueNameChange,setValueNameChange]=useState<string>('');
	const [valueNumberChange,setValueNumberChange]=useState<string>('');

	const changeContact=async()=>{
		await axios.put(urlServer+`contact/${idRecord}`,{
			name:valueNameChange,
			number:valueNumberChange
		})
		getUsers();
		setActivity2(false);

	}
	const changeValueNameCh=(e:React.ChangeEvent<HTMLInputElement>)=>{
		setValueNameChange(e.target.value);
	}
	const changeValueNumberCh=(e:React.ChangeEvent<HTMLInputElement>)=>{
		setValueNumberChange(e.target.value);
	}
	const changeModalShow=()=>{
		setActivity2(true);
		if(indexRecord!==-1){
			setValueNameChange(users[indexRecord].name)
			setValueNumberChange(users[indexRecord].number)
		}
		
	}


	return (
		<div className="App">
			{!loader?
			<header className="App-header">
				
				<h1>Контакты</h1>
				<div className='flex buttons'>
					<button onClick={()=>setActivity(true)}>Добавить</button>
					<button onClick={()=>changeModalShow()}>Изменить</button>
					<button onClick={()=>setActivity1(true)}>Удалить</button>
				</div>
				
				<Users users={users} setIdRecord={setIdAndIndex} idRecord={idRecord} />
				<Modal active={activity} setActive={clearForm} >
					<div>
						<h3>Новый контакт</h3>
						<input type="text" placeholder='Имя' maxLength={20}  value={valueName} onChange={(e)=>changeValueName(e)} />
						<InputMask mask="+7(999)999-99-99" type="text" placeholder='Номер'  value={valueNumber} onChange={(e)=>changeValueNumber(e)} />
						<div>
							<button onClick={() => clearForm()}>Отмена</button>
							<button onClick={() => addContact()}>Добавить</button>
						</div>
					</div>
				</Modal>
				<Modal active={activity1} setActive={setActivity1} >
					{indexRecord!==-1?
						<div>
						<h3>Удаление контакта</h3>
						<p>Вы точно хотите удалить контакт <b>{users[indexRecord].name}</b> из списка?</p>
						<div>
							<button onClick={() => setActivity1(false)}>Отмена</button>
							<button onClick={() => deleteContact()}>Удалить</button>
						</div>
					</div>
					:<div><p>Выберите контакт который хотите удалить кликнув по нему</p></div>}
				</Modal>
				<Modal active={activity2} setActive={setActivity2}>
					{indexRecord!==-1?<div>
						<h3>Изменение</h3>
						<input type="text" placeholder='Имя' maxLength={20}  value={valueNameChange} onChange={(e)=>changeValueNameCh(e)} />
						<InputMask mask="+7(999)999-99-99" type="text" placeholder='Номер'  value={valueNumberChange} onChange={(e)=>changeValueNumberCh(e)} />
						<div>
							<button onClick={() => setActivity2(false)}>Отмена</button>
							<button onClick={() => changeContact()}>Изменить</button>
						</div>
					</div>
					: <div><p>Выберите контакт который хотите изменить кликнув по нему</p></div>}
				</Modal>
			</header>
				: <div className='bodyloader'><div className="lds-dual-ring"></div></div>}
		</div>
	);
}

export default App;
