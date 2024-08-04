import React from 'react'

import { ForbiddenIcon } from '../../../icons'
import { useNavigate } from 'react-router'
import { getUser } from '../../../utils/constant';

function Page404() {
    const navigate = useNavigate();
    const user = getUser();

    const handleBack = () => {
        const role = user.role;
        if(role?.includes("ADMIN")){
            navigate('/admin/dashboard')
        }else if(role?.includes("MANAGER")){
            navigate('/manager/dashboard')
        }else if(role?.includes("WAITER")){
            navigate('/waiter/map')
        }else if(role?.includes("CHEF")){
            navigate('/chef/dishPreparation')
        }else if(role?.includes("HOSTESS")){
            navigate('/hostess/map')
        }
    }


    return (
        <div className="flex flex-col items-center">
            <ForbiddenIcon className="w-12 h-12 mt-8 text-purple-200" aria-hidden="true" />
            <h1 className="text-6xl font-semibold text-gray-700 dark:text-gray-200">404</h1>
            <p className="text-gray-700 dark:text-gray-300">
                Page not found. Check the address or{' '}
                <span className="text-purple-600 hover:underline dark:text-purple-300 cursor-pointer" onClick={() => handleBack()}>
                    go back
                </span>
                .
            </p>
        </div>
    )
}

export default Page404
