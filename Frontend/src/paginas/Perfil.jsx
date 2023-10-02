import React from 'react'
import { CardPerfil } from '../componets/Perfil/CardPerfil'

const Perfil = () => {
    return (
      <>
        <div>
          <h1 className="font-black text-4xl text-gray-500">Perfil</h1>
          <hr className="my-4" />
          <p className="mb-8">
          </p>
        </div>

          <div className="w-full md:w-1/2">
            <CardPerfil />
          </div>
      </>
    );
}

export default Perfil