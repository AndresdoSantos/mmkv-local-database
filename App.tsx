import { View, TextInput, Button, Text } from 'react-native'
import { useEffect, useState } from 'react'
import { useMMKV, useMMKVObject } from 'react-native-mmkv'

import { styles } from './styles'

// const storage = new MMKV({ id: 'myapp' })

type User = {
  name: string
  email: string
}

export default function App() {
  const storage = useMMKV({ id: 'myapp' })

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const [user, setUser] = useMMKVObject<User>('user')

  const fetchUser = () => {
    const data = storage.getString('user')

    setUser(data ? JSON.parse(data) : {})
  }

  const handleSave = () => {
    setUser({
      email,
      name,
    })
  }

  useEffect(() => {
    const listener = storage.addOnValueChangedListener((changedKey) => {
      const newValue = storage.getString(changedKey)

      console.log('NOVO VALOR - ', newValue)

      fetchUser()
    })

    return () => listener.remove()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nome..."
        style={styles.input}
        onChangeText={setName}
        value={name}
      />
      <TextInput
        placeholder="Email..."
        style={styles.input}
        onChangeText={setEmail}
        value={email}
      />

      <Button title="Salvar" onPress={handleSave} />

      <Text>{user?.name}</Text>
      <Text>{user?.email}</Text>
    </View>
  )
}
