import React, { FC } from 'react';
import { IUsers } from '../types/types';

interface UsersProps {
    users: IUsers[];
    setIdRecord:(num:number)=>void;
    idRecord:number;
}

const Users: FC<UsersProps> = ({ users, setIdRecord,idRecord }) => {
    
    return (
        <div className='w60'>
            <table className="table">
                <thead>
                    <tr>
                        <th>Имя</th>
                        <th>Номер телефона</th>
                    </tr>
                </thead>
            </table>
            <div className='scroll-table'>
                <table className="table">
                    <tbody>
                        {users.map(u => <tr 
                            onClick={()=>setIdRecord(u.id)} key={u.id} 
                            className={u.id===idRecord?'select':''
                        }>
                            <td>{u.name}</td>
                            <td>{u.number}</td>
                        </tr>)}
                    </tbody>
                </table>
            </div>
        </div>
            

    )
}
export default Users